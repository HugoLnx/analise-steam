from django.test import TestCase

from games.models import Game, Tag


class GamesApiTests(TestCase):

    @classmethod
    def setUpTestData(cls):

        # Jogos genéricos para paginação
        for i in range(30):

            Game.objects.create(
                appid=i,
                name=f"Game {i}",
                revenue_1year=100
            )

        # Jogo FPS + Arena Shooter
        game = Game.objects.create(
            appid=1000,
            name="FPS Arena"
        )

        Tag.objects.create(
            game=game,
            name="FPS"
        )

        Tag.objects.create(
            game=game,
            name="Arena Shooter"
        )

        # Jogo Psychological Horror
        game2 = Game.objects.create(
            appid=1001,
            name="Psychological Horror Game"
        )

        Tag.objects.create(
            game=game2,
            name="Psychological Horror"
        )

    def test_first_page_returns_20_games(self):

        response = self.client.get(
            "/api/games/?page=1"
        )

        self.assertEqual(
            len(response.json()["results"]),
            20
        )

    def test_second_page_returns_remaining_games(self):

        response = self.client.get(
            "/api/games/?page=2"
        )

        self.assertEqual(
            len(response.json()["results"]),
            12
        )

    def test_include_and_filter(self):

        response = self.client.get(
            "/api/games/",
            {
                "filter_tags":
                "INCLUDE_AND FPS,Arena Shooter"
            }
        )

        names = [
            game["name"]
            for game in response.json()["results"]
        ]

        self.assertIn(
            "FPS Arena",
            names
        )

    def test_exact_tag_match(self):

        response = self.client.get(
            "/api/games/",
            {
                "filter_tags":
                "INCLUDE_AND Horror"
            }
        )

        names = [
            game["name"]
            for game in response.json()["results"]
        ]

        self.assertNotIn(
            "Psychological Horror Game",
            names
        )