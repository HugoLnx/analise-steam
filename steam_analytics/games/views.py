from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q

from .models import Game, Tag


def home(request):
    return render(request, "games/index.html")


def build_or_query(tags):

    query = Q()

    for tag in tags:

        query |= Q(
            tags__name__iexact=tag
        )

    return query


def list_games(request):

    games = Game.objects.all()

    # ==========================================
    # NOVOS FILTROS
    # ==========================================
    title = request.GET.get("title", "").strip()
    if title:
        games = games.filter(name__icontains=title)

    only_br = request.GET.get("only_br", "false").lower() == "true"
    if only_br:
        games = games.filter(tags__name__iexact="brazilian")

    # Reviews 1 Year
    rev_min = request.GET.get("reviews_min")
    if rev_min:
        games = games.filter(review_count_1year__gte=float(rev_min))
    rev_max = request.GET.get("reviews_max")
    if rev_max:
        games = games.filter(review_count_1year__lte=float(rev_max))

    # Revenue 1 Year
    revenue_min = request.GET.get("revenue_min")
    if revenue_min:
        games = games.filter(revenue_1year__gte=float(revenue_min))
    revenue_max = request.GET.get("revenue_max")
    if revenue_max:
        games = games.filter(revenue_1year__lte=float(revenue_max))

    # Price
    price_min = request.GET.get("price_min")
    if price_min:
        games = games.filter(price__gte=float(price_min))
    price_max = request.GET.get("price_max")
    if price_max:
        games = games.filter(price__lte=float(price_max))

    # Weeks Ago
    from datetime import datetime, timedelta
    weeks_min = request.GET.get("weeks_min")
    if weeks_min:
        date_limit = datetime.now() - timedelta(weeks=float(weeks_min))
        games = games.filter(release_date__lte=date_limit.date())
    weeks_max = request.GET.get("weeks_max")
    if weeks_max:
        date_limit = datetime.now() - timedelta(weeks=float(weeks_max))
        games = games.filter(release_date__gte=date_limit.date())

    filter_tags = request.GET.get(
        "filter_tags",
        ""
    ).strip()

    include_or_groups = []

    exclude_groups = []

    # ==========================================
    # PARSER
    # ==========================================

    if filter_tags:

        groups = [
            group.strip()
            for group in filter_tags.split(";")
            if group.strip()
        ]

        for group in groups:

            parts = group.split(" ", 1)

            if len(parts) != 2:
                continue

            command = parts[0].strip().upper()

            tags = [
                tag.strip()
                for tag in parts[1].split(",")
                if tag.strip()
            ]

            # ======================================
            # INCLUDE_AND
            # ======================================

            if command == "INCLUDE_AND":

                for tag in tags:

                    games = games.filter(
                        tags__name__iexact=tag
                    )

            # ======================================
            # INCLUDE_OR
            # ======================================

            elif command == "INCLUDE_OR":

                include_or_groups.append(
                    build_or_query(tags)
                )

            # ======================================
            # EXCLUDE_AND
            # ======================================

            elif command == "EXCLUDE_AND":

                exclude_query = Q()

                first = True

                for tag in tags:

                    condition = Q(
                        tags__name__iexact=tag
                    )

                    if first:
                        exclude_query = condition
                        first = False
                    else:
                        exclude_query &= condition

                exclude_groups.append(
                    exclude_query
                )

            # ======================================
            # EXCLUDE_OR
            # ======================================

            elif command == "EXCLUDE_OR":

                exclude_groups.append(
                    build_or_query(tags)
                )

    # ==========================================
    # INCLUDE_OR
    # ==========================================

    if include_or_groups:

        include_query = Q()

        first = True

        for q in include_or_groups:

            if first:
                include_query = q
                first = False
            else:
                include_query |= q

        games = games.filter(
            include_query
        )

    # ==========================================
    # EXCLUDES
    # ==========================================

    for q in exclude_groups:

        games = games.exclude(q)

    games = games.distinct()

    # ==========================================
    # ORDENAÇÃO
    # ==========================================

    sort = request.GET.get(
        "sort",
        "revenue"
    )

    if sort == "reviews":

        games = games.order_by(
            "-review_count"
        )

    elif sort == "price":

        games = games.order_by(
            "-price"
        )

    elif sort == "release":

        games = games.order_by(
            "-release_date"
        )

    else:

        games = games.order_by(
            "-revenue_1year"
        )

    # ==========================================
    # PAGINAÇÃO
    # ==========================================

    try:
        page = int(
            request.GET.get("page", 1)
        )
    except:
        page = 1

    per_page = 20

    total = games.count()

    start = (page - 1) * per_page
    end = start + per_page

    games = games[start:end]

    # ==========================================
    # SERIALIZAÇÃO
    # ==========================================

    data = []

    for game in games:

        tags = list(
            game.tags.all().values_list(
                "name",
                flat=True
            )
        )

        data.append({

            "appid": game.appid,
            "name": game.name,
            "price": game.price,
            "release_date": game.release_date,
            "review_count": game.review_count,
            "revenue_1year": game.revenue_1year,
            "tags": tags,
            "screenshot_urls": game.screenshot_urls,
            "capsule_url": game.capsule_url,
            "review_count_1year": game.review_count_1year,
            "review_impression": game.review_impression,

        })

    return JsonResponse({

        "results": data,
        "page": page,
        "per_page": per_page,
        "total": total,
        "total_pages":
            (total + per_page - 1) // per_page,

    })


def list_tags(request):
    tags = Tag.objects.values_list('name', flat=True).distinct().order_by('name')
    return JsonResponse(list(tags), safe=False)
