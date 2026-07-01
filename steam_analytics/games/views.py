from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from datetime import datetime, timedelta

from .models import Game, Tag


def home(request):
    return render(request, "games/index.html")


def build_or_query(field, values):
    query = Q()
    for value in values:
        query |= Q(**{f"{field}__iexact": value})
    return query


ALLOWED_FILTER_FIELDS = {
    "tags": "tags__name__iexact",
    "features": "features__name__iexact",
    "multiplayer_support": "multiplayer_support__name__iexact",
    "gamepad_support": "gamepad_support__name__iexact",
    "steamdeck_support": "steamdeck_support__name__iexact",
    "languages": "languages__name__iexact",
}


def list_games(request):

    games = Game.objects.all()

    # ==========================================
    # NOVOS FILTROS
    # ==========================================
    # Exemplo de tag:
    #   features:Co-op
    #   multiplayer:Single-player
    #   languages:Portuguese
    
    # Formato do filtro: mesmo esquema atual em `filter_tags`, só que cada tag vem como "categoria:valor".
    categoria_map = {
        'features': 'features',
        'multiplayer': 'multiplayer_support',
        'gamepad': 'gamepad_support',
        'steamdeck': 'steamdeck_support',
        'languages': 'languages',
    }

    def parse_functional_tag(token: str):
        token = (token or '').strip()
        if ':' not in token:
            return None
        cat, val = token.split(':', 1)
        cat = cat.strip()
        val = val.strip()
        if not cat or not val:
            return None
        model_field = categoria_map.get(cat)
        if not model_field:
            return None
        return model_field, val

    def apply_clause_to_queryset(qs, clause_command: str, tokens: list[str]):
        # INCLUDE_AND/EXCLUDE_AND => todas as tokens (AND por token)
        # INCLUDE_OR/EXCLUDE_OR  => qualquer token (OR por token)
        parsed = [parse_functional_tag(t) for t in tokens]
        parsed = [p for p in parsed if p is not None]
        if not parsed:
            return qs

        # Agrupar por campo (caso venham múltiplas categorias no mesmo clause)
        by_field = {}
        for field, value in parsed:
            by_field.setdefault(field, []).append(value)

        # Importante:
        # Em alguns backends/DBs, lookup `__contains` em JSONField não é suportado.
        # Para evitar 500, fazemos o filtro em Python (garantindo compatibilidade).
        # O custo é maior do que filtrar no banco, mas mantém a funcionalidade.

        def _field_has_value(item_list, v: str) -> bool:
            if not item_list:
                return False
            if isinstance(item_list, list):
                return v in [str(x) for x in item_list]
            return str(item_list) == v

        # Materializa apenas o necessário para avaliação em Python.
        # (mantém `appid` e os campos funcionais)
        only_fields = set(by_field.keys())
        rows = list(qs.values_list('appid', *only_fields))

        # index: appid -> valores por campo
        appid_to_fields = {}
        for row in rows:
            appid = row[0]
            field_values = row[1:]
            appid_to_fields[appid] = dict(zip(only_fields, field_values))

        matched_appids = None

        for field, values in by_field.items():
            values = [str(x) for x in values]

            if clause_command in ('INCLUDE_AND', 'INCLUDE_OR'):
                current = set()
                for appid, fvals in appid_to_fields.items():
                    field_value = fvals.get(field)
                    if clause_command == 'INCLUDE_AND':
                        if all(_field_has_value(field_value, v) for v in values):
                            current.add(appid)
                    else:  # INCLUDE_OR
                        if any(_field_has_value(field_value, v) for v in values):
                            current.add(appid)

                matched_appids = current if matched_appids is None else (matched_appids & current)

            elif clause_command in ('EXCLUDE_AND', 'EXCLUDE_OR'):
                current = set()
                for appid, fvals in appid_to_fields.items():
                    field_value = fvals.get(field)
                    if clause_command == 'EXCLUDE_AND':
                        # remove quem contém TODAS as values (AND por valor)
                        if not all(_field_has_value(field_value, v) for v in values):
                            current.add(appid)
                    else:  # EXCLUDE_OR
                        # remove quem contém QUALQUER value (OR por valor)
                        if not any(_field_has_value(field_value, v) for v in values):
                            current.add(appid)

                matched_appids = current if matched_appids is None else (matched_appids & current)

        # Se nada foi filtrado (casos extremos), retorna qs original
        if matched_appids is None:
            return qs

        return qs.filter(appid__in=matched_appids)

    title = request.GET.get("title", "").strip()
    if title:
        games = games.filter(name__icontains=title)

    # BR FILTER
    only_br = request.GET.get("only_br", "false").lower() == "true"
    if only_br:
        games = games.filter(is_br=True)

    # REVIEWS / REVENUE / PRICE
    if request.GET.get("reviews_min"):
        games = games.filter(review_count_1year__gte=float(request.GET["reviews_min"]))

    if request.GET.get("reviews_max"):
        games = games.filter(review_count_1year__lte=float(request.GET["reviews_max"]))

    if request.GET.get("revenue_min"):
        games = games.filter(revenue_1year__gte=float(request.GET["revenue_min"]))

    if request.GET.get("revenue_max"):
        games = games.filter(revenue_1year__lte=float(request.GET["revenue_max"]))

    if request.GET.get("price_min"):
        games = games.filter(price__gte=float(request.GET["price_min"]))

    if request.GET.get("price_max"):
        games = games.filter(price__lte=float(request.GET["price_max"]))

    # DATE
    if request.GET.get("weeks_min"):
        date_limit = datetime.now() - timedelta(weeks=float(request.GET["weeks_min"]))
        games = games.filter(release_date__lte=date_limit.date())

    if request.GET.get("weeks_max"):
        date_limit = datetime.now() - timedelta(weeks=float(request.GET["weeks_max"]))
        games = games.filter(release_date__gte=date_limit.date())

    # FILTER ENGINE
    filter_tags = request.GET.get("filter_tags", "").strip()

    include_ids = set()
    exclude_ids = set()

    if filter_tags:

        groups = [g.strip() for g in filter_tags.split(";") if g.strip()]

        for group in groups:

            parts = group.split(" ", 1)
            if len(parts) != 2:
                continue

            command = parts[0].strip().upper()
            raw = parts[1].strip()

            field = "tags__name__iexact"
            values_raw = raw

            if ":" in raw:
                field_key, values_raw = raw.split(":", 1)
                field = ALLOWED_FILTER_FIELDS.get(field_key.strip(), "tags__name__iexact")

            values = [v.strip() for v in values_raw.split(",") if v.strip()]

            qs = Game.objects.all()

            if command == "INCLUDE_AND":
                for value in values:
                    qs = qs.filter(**{field: value})
                include_ids |= set(qs.values_list("appid", flat=True))

            elif command == "INCLUDE_OR":
                qs = Game.objects.filter(build_or_query(field, values))
                include_ids |= set(qs.values_list("appid", flat=True))

            elif command == "EXCLUDE_AND":
                for value in values:
                    qs = qs.filter(**{field: value})
                exclude_ids |= set(qs.values_list("appid", flat=True))

            elif command == "EXCLUDE_OR":
                qs = Game.objects.filter(build_or_query(field, values))
                exclude_ids |= set(qs.values_list("appid", flat=True))

    if include_ids:
        games = games.filter(appid__in=include_ids)

    if exclude_ids:
        games = games.exclude(appid__in=exclude_ids)

    games = games.distinct()

    # ORDER
    sort = request.GET.get("sort", "revenue")

    order_map = {
        "reviews": "-review_count",
        "price": "-price",
        "release": "-release_date",
        "revenue": "-revenue_1year",
    }

    games = games.order_by(order_map.get(sort, "-revenue_1year"))

    # PAGINATION
    page = int(request.GET.get("page", 1))
    per_page = 20

    total = games.count()

    start = (page - 1) * per_page
    end = start + per_page

    games = games[start:end]

    # PREFETCH
    games = games.prefetch_related(
        "tags",
        "features_rel",
        "multiplayer_support_rel",
        "gamepad_support_rel",
        "steamdeck_support_rel",
        "languages_rel"
    )

    # SERIALIZATION
    data = []

    for game in games:
        data.append({
            "appid": game.appid,
            "name": game.name,
            "price": game.price,
            "release_date": game.release_date,
            "review_count": game.review_count,
            "review_count_1year": game.review_count_1year,
            "revenue_1year": game.revenue_1year,
            "review_impression": game.review_impression,

            "tags": list(game.tags.values_list("name", flat=True)),
            "features": list(game.features_rel.values_list("name", flat=True)),
            "multiplayer_support": list(game.multiplayer_support_rel.values_list("name", flat=True)),
            "gamepad_support": list(game.gamepad_support_rel.values_list("name", flat=True)),
            "steamdeck_support": list(game.steamdeck_support_rel.values_list("name", flat=True)),
            "languages": list(game.languages_rel.values_list("name", flat=True)),


            "screenshot_urls": game.screenshot_urls,
            "capsule_url": game.capsule_url,

            "is_br": game.is_br,
        })

    return JsonResponse({
        "results": data,
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages": (total + per_page - 1) // per_page,
    })


def list_tags(request):
    tags = Tag.objects.values_list("name", flat=True).distinct().order_by("name")
    return JsonResponse(list(tags), safe=False)