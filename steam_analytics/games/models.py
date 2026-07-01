from django.db import models


class Game(models.Model):

    appid = models.IntegerField(primary_key=True)

    name = models.CharField(max_length=255)

    price = models.FloatField(null=True)

    release_date = models.DateField(null=True)

    review_count = models.IntegerField(null=True)

    revenue_1year = models.FloatField(null=True)

    screenshot_urls = models.JSONField(default=list, null=True)
    capsule_url = models.URLField(max_length=500, null=True)
    review_count_1year = models.FloatField(null=True)
    review_impression = models.CharField(max_length=100, null=True)

    # 🇧🇷 FLAG BR (NOVO)
    is_br = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Tag(models.Model):

    game = models.ForeignKey(
        Game,
        related_name="tags",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Feature(models.Model):

    game = models.ForeignKey(
        Game,
        related_name="features",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class MultiplayerSupport(models.Model):

    game = models.ForeignKey(
        Game,
        related_name="multiplayer_support",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class GamepadSupport(models.Model):

    game = models.ForeignKey(
        Game,
        related_name="gamepad_support",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class SteamDeckSupport(models.Model):

    game = models.ForeignKey(
        Game,
        related_name="steamdeck_support",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Language(models.Model):

    game = models.ForeignKey(
        Game,
        related_name="languages",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Ranking(models.Model):

    game = models.ForeignKey(
        Game,
        related_name="rankings",
        on_delete=models.CASCADE
    )

    tag = models.CharField(max_length=100)

    type = models.CharField(max_length=50)

    position = models.IntegerField()

    def __str__(self):
        return f"{self.game.name} - {self.tag}"