import json
from datetime import date

from django.test import TestCase

from games.models import Game, Tag


class ListGamesAPITest(TestCase):

    def setUp(self):
        game1 = Game.objects.create(
            appid=1,
            name="Game Alpha",
            price=29.99,
            release_date=date(2022, 1, 15),
            review_count=1500,
            revenue_1year=45000.0,
        )
        Tag.objects.create(game=game1, name="Action")
        Tag.objects.create(game=game1, name="RPG")

        game2 = Game.objects.create(
            appid=2,
            name="Game Beta",
            price=9.99,
            release_date=date(2023, 6, 1),
            review_count=300,
            revenue_1year=3000.0,
        )
        Tag.objects.create(game=game2, name="Indie")

    def test_basic_list_returns_200_with_expected_shape(self):
        response = self.client.get("/api/games/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response["Content-Type"], "application/json"
        )

        data = json.loads(response.content)

        for key in ("results", "page", "per_page", "total", "total_pages"):
            self.assertIn(key, data, msg=f"Missing key: {key}")

        self.assertEqual(data["total"], 2)

        expected_fields = {
            "appid", "name", "price", "release_date",
            "review_count", "revenue_1year", "tags",
        }
        for item in data["results"]:
            self.assertEqual(set(item.keys()), expected_fields)
            self.assertIsInstance(item["tags"], list)
            for tag in item["tags"]:
                self.assertIsInstance(tag, str)
