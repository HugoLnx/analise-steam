# Backend: Django (Python)
FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (better layer caching)
COPY steam_analytics/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY steam_analytics /app

EXPOSE 8000

# Entrypoint: run migrations at startup, then start dev server
# (sqlite3 file will be volume-mounted by docker-compose)
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

