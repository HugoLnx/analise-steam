from django.urls import path

from .views import (
    home,
    list_games,
    list_tags
)

urlpatterns = [

    path(
        "",
        home
    ),

    path(
        "api/games/",
        list_games
    ),

    path(
        "api/tags/",
        list_tags
    ),
]