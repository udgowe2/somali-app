#!/bin/sh
set -e

echo "Warte auf Datenbank..."
until node -e "
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL });
c.connect().then(() => { c.end(); process.exit(0); }).catch(() => process.exit(1));
" 2>/dev/null; do
  sleep 2
done

echo "Datenbank bereit — Schema synchronisieren..."
node /app/node_modules/prisma/build/index.js db push --skip-generate

echo "App starten..."
exec node server.js
