import json

from django.test import TestCase


def appids(data):
    return {item["appid"] for item in data["results"]}


class ListGamesAPITest(TestCase):

    fixtures = ["test_games.json"]

    # Fixture summary:
    #   appid=1  tags: Action, RPG
    #   appid=2  tags: Indie
    #   appid=3  tags: Horror
    #   appid=4  tags: Psychological Horror
    #   appid=5  tags: Survival Horror
    #   appid=6  tags: Action, Indie

    def test_basic_list_returns_200_with_expected_shape(self):
        response = self.client.get("/api/games/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/json")

        data = json.loads(response.content)

        for key in ("results", "page", "per_page", "total", "total_pages"):
            self.assertIn(key, data, msg=f"Missing key: {key}")

        self.assertEqual(data["total"], 6)

        expected_fields = {
            "appid", "name", "price", "release_date",
            "review_count", "revenue_1year", "tags",
        }
        for item in data["results"]:
            self.assertEqual(set(item.keys()), expected_fields)
            self.assertIsInstance(item["tags"], list)
            for tag in item["tags"]:
                self.assertIsInstance(tag, str)

    # ------------------------------------------------------------------
    # Filtro exato por tag "Horror"
    # ------------------------------------------------------------------

    def test_filter_horror_excludes_partial_matches(self):
        # Jogos com "Psychological Horror" e "Survival Horror" NÃO devem aparecer;
        # apenas o jogo cuja tag é exatamente "Horror" deve ser retornado.
        response = self.client.get(
            "/api/games/", {"filter_tags": "INCLUDE_AND Horror"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {3})

    # ------------------------------------------------------------------
    # INCLUDE_AND
    # ------------------------------------------------------------------

    def test_include_and_single_tag(self):
        response = self.client.get(
            "/api/games/", {"filter_tags": "INCLUDE_AND Action"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {1, 6})

    def test_include_and_two_tags_requires_both(self):
        # Apenas jogos que tenham AMBAS as tags devem ser retornados.
        # appid=6 tem Action mas não tem RPG, portanto não deve aparecer.
        response = self.client.get(
            "/api/games/", {"filter_tags": "INCLUDE_AND Action,RPG"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {1})

    # ------------------------------------------------------------------
    # INCLUDE_OR
    # ------------------------------------------------------------------

    def test_include_or_single_tag(self):
        response = self.client.get(
            "/api/games/", {"filter_tags": "INCLUDE_OR Action"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {1, 6})

    def test_include_or_two_tags_matches_either(self):
        # Jogos com Action OU Indie devem aparecer.
        response = self.client.get(
            "/api/games/", {"filter_tags": "INCLUDE_OR Action,Indie"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {1, 2, 6})

    # ------------------------------------------------------------------
    # EXCLUDE_AND
    # ------------------------------------------------------------------

    def test_exclude_and_single_tag(self):
        # Com uma tag só, EXCLUDE_AND e EXCLUDE_OR têm o mesmo efeito.
        response = self.client.get(
            "/api/games/", {"filter_tags": "EXCLUDE_AND Action"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {2, 3, 4, 5})

    def test_exclude_and_two_tags_only_excludes_when_both_present(self):
        # Somente jogos que tenham AMBAS Action E RPG são excluídos (appid=1).
        # appid=6 tem Action mas não RPG, portanto deve permanecer.
        response = self.client.get(
            "/api/games/", {"filter_tags": "EXCLUDE_AND Action,RPG"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {2, 3, 4, 5, 6})

    # ------------------------------------------------------------------
    # EXCLUDE_OR
    # ------------------------------------------------------------------

    def test_exclude_or_single_tag(self):
        # Com uma tag só, EXCLUDE_AND e EXCLUDE_OR têm o mesmo efeito.
        response = self.client.get(
            "/api/games/", {"filter_tags": "EXCLUDE_OR Action"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {2, 3, 4, 5})

    def test_exclude_or_two_tags_excludes_when_either_present(self):
        # Jogos com Action OU Indie são excluídos (appids 1, 2, 6).
        response = self.client.get(
            "/api/games/", {"filter_tags": "EXCLUDE_OR Action,Indie"}
        )
        data = json.loads(response.content)
        self.assertEqual(appids(data), {3, 4, 5})
