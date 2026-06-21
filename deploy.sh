#!/bin/sh
set -e

# Auf dem Synology NAS ausführen: sh deploy.sh

if [ ! -f .env ]; then
  echo "FEHLER: .env Datei fehlt!"
  echo "Erstelle sie mit:"
  echo "  cp .env.example .env"
  echo "  nano .env   # Werte anpassen"
  exit 1
fi

echo "Verzeichnisse vorbereiten..."
mkdir -p data/postgres
mkdir -p public/audio

echo "Code aktualisieren..."
git pull

echo "Container bauen und starten..."
docker compose up -d --build

echo "Logs der letzten 20 Zeilen:"
docker compose logs --tail=20 somali-app
