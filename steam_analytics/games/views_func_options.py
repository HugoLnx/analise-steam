from django.http import JsonResponse
from django.db.models import QuerySet
from .models import Game


def _unique_values_from_jsonfield(qs: QuerySet[Game], field_name: str):
    # field is expected to be JSON array of strings
    # Since we can't assume DB JSON operators across vendors, do it in Python.
    values = set()
    for item in qs.values_list(field_name, flat=True):
        if not item:
            continue
        if isinstance(item, list):
            for v in item:
                if v is not None:
                    values.add(str(v))
        else:
            # be tolerant if the DB has unexpected shapes
            values.add(str(item))
    return sorted(values)


def func_options(request):
    # categories: features, multiplayer, gamepad, steamdeck, languages
    category = request.GET.get("category", "").strip()

    if category:
        category_map = {
            "features": "features",
            "multiplayer": "multiplayer_support",
            "gamepad": "gamepad_support",
            "steamdeck": "steamdeck_support",
            "languages": "languages",
        }
        field = category_map.get(category)
        if not field:
            return JsonResponse({"error": "Invalid category"}, status=400)
        qs = Game.objects.all()
        return JsonResponse(_unique_values_from_jsonfield(qs, field), safe=False)

    qs = Game.objects.all()
    out = {
        "features": _unique_values_from_jsonfield(qs, "features"),
        "multiplayer": _unique_values_from_jsonfield(qs, "multiplayer_support"),
        "gamepad": _unique_values_from_jsonfield(qs, "gamepad_support"),
        "steamdeck": _unique_values_from_jsonfield(qs, "steamdeck_support"),
        "languages": _unique_values_from_jsonfield(qs, "languages"),
    }
    return JsonResponse(out)

