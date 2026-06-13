from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q

from .models import Game


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

    filter_tags = request.GET.get(
        "filter_tags",
        ""
    ).strip()

    include_groups = []
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

                group_games = Game.objects.all()

                for tag in tags:

                    group_games = group_games.filter(
                        tags__name__iexact=tag
                    )

                include_groups.append(
                    set(
                        group_games.values_list(
                            "appid",
                            flat=True
                        )
                    )
                )

            # ======================================
            # INCLUDE_OR
            # ======================================

            elif command == "INCLUDE_OR":

                group_games = Game.objects.filter(
                    build_or_query(tags)
                )

                include_groups.append(
                    set(
                        group_games.values_list(
                            "appid",
                            flat=True
                        )
                    )
                )

            # ======================================
            # EXCLUDE_AND
            # ======================================

            elif command == "EXCLUDE_AND":

                group_games = Game.objects.all()

                for tag in tags:

                    group_games = group_games.filter(
                        tags__name__iexact=tag
                    )

                exclude_groups.append(
                    set(
                        group_games.values_list(
                            "appid",
                            flat=True
                        )
                    )
                )

            # ======================================
            # EXCLUDE_OR
            # ======================================

            elif command == "EXCLUDE_OR":

                group_games = Game.objects.filter(
                    build_or_query(tags)
                )

                exclude_groups.append(
                    set(
                        group_games.values_list(
                            "appid",
                            flat=True
                        )
                    )
                )

    # ==========================================
    # INCLUDES
    # ==========================================

    if include_groups:

        include_ids = set()

        for group in include_groups:

            include_ids |= group

        games = games.filter(
            appid__in=include_ids
        )

    # ==========================================
    # EXCLUDES
    # ==========================================

    if exclude_groups:

        exclude_ids = set()

        for group in exclude_groups:

            exclude_ids |= group

        games = games.exclude(
            appid__in=exclude_ids
        )

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