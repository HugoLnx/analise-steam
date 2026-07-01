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

    # TITLE
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
        "features",
        "multiplayer_support",
        "gamepad_support",
        "steamdeck_support",
        "languages"
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
            "features": list(game.features.values_list("name", flat=True)),
            "multiplayer_support": list(game.multiplayer_support.values_list("name", flat=True)),
            "gamepad_support": list(game.gamepad_support.values_list("name", flat=True)),
            "steamdeck_support": list(game.steamdeck_support.values_list("name", flat=True)),
            "languages": list(game.languages.values_list("name", flat=True)),

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