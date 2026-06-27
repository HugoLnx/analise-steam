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


def as_list(value):
    """Garante que o valor do JSON vire lista.

    - Se for None -> []
    - Se já for list -> mantém
    - Caso contrário -> envolve em lista (mantém o valor mesmo que venha string/objeto)
    """
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]



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
                "revenue_1year": raw.get("revenue_1year"),
                "screenshot_urls": raw.get("screenshot_urls", []),
                "capsule_url": raw.get("capsule_url"),
                "review_count_1year": raw.get("review_count_1year"),
                "review_impression": raw.get("review_impression"),
                # TODO: #22 - Importar metadados de funcionalidades do JSON (ex: flags.multiplayer_support, etc.)
                "features": as_list(raw.get("flags", {}).get("features")),
                "multiplayer_support": as_list(raw.get("flags", {}).get("multiplayer_support")),
                "gamepad_support": as_list(raw.get("flags", {}).get("gamepad_support")),
                "steamdeck_support": as_list(raw.get("flags", {}).get("steamdeck_support")),
                "languages": as_list(raw.get("flags", {}).get("languages")),



            }
        )

        # tags
        Tag.objects.filter(game=game_obj).delete()
        for tag in raw.get("raw_main_tags", []):
            Tag.objects.create(game=game_obj, name=tag)

        # TODO: #18 - Criar lógica ou comando adicional para baixar/ler as linhas de IDs do arquivo txt externo (https://github.com/user-attachments/files/29065218/all-br-games.txt)
        # TODO: #18 - Verificar se o `game_obj.appid` atual está contido nessa lista e automaticamente criar/garantir a Tag(name="brazilian") ou campo específico correspondente

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