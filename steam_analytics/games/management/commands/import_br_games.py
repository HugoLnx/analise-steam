from django.core.management.base import BaseCommand
from games.models import Game


class Command(BaseCommand):
    help = "Importa jogos brasileiros a partir de um arquivo .txt"

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **options):

        file_path = options["file_path"]

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                ids = {
                    int(line.strip())
                    for line in f
                    if line.strip().isdigit()
                }

            updated = Game.objects.filter(appid__in=ids).update(is_br=True)

            self.stdout.write(
                self.style.SUCCESS(
                    f"Importação BR finalizada: {updated} jogos marcados como BR"
                )
            )

        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR("Arquivo não encontrado")
            )