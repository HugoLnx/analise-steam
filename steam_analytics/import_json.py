import os
import django
import json
import sys
from datetime import datetime
from urllib.request import urlopen

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'steam_analytics.settings')
django.setup()

from games.models import Game, Tag, Ranking


def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except:
        return None


def load_json(source):
    # Se for link
    if source.startswith("http"):
        with urlopen(source) as response:
            return json.loads(response.read().decode())
    else:
        # Se for arquivo local
        with open(source, 'r', encoding='utf-8') as f:
            return json.load(f)


def import_json(source):
    data = load_json(source)

    for game in data.get("games", []):
        raw = game.get("raw_data", {})

        if not raw.get("appid"):
            continue

        game_obj, _ = Game.objects.update_or_create(
            appid=int(raw.get("appid")),
            defaults={
                "name": raw.get("name"),
                "price": raw.get("price"),
                "release_date": parse_date(raw.get("date")),
                "review_count": raw.get("review_count"),
                "revenue_1year": raw.get("revenue_1year")
            }
        )

        # tags
        Tag.objects.filter(game=game_obj).delete()
        for tag in raw.get("raw_main_tags", []):
            Tag.objects.create(game=game_obj, name=tag)

        # rankings
        Ranking.objects.filter(game=game_obj).delete()
        rankings = game.get("rankings", {})

        for r_type, values in rankings.items():
            for tag, position in values.items():
                Ranking.objects.create(
                    game=game_obj,
                    tag=tag,
                    type=r_type,
                    position=position
                )

    print("Importação finalizada!")


if __name__ == "__main__":
    import_json(sys.argv[1])