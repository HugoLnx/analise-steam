from django.urls import path

from .views import (
    home,
    list_games,
    list_tags,
)

from .views_func_options import func_options


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

    path(
        "api/func_options/",
        func_options
    ),

]