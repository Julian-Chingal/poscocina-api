#!/bin/sh
set -e

if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "📦 Ejecutando migraciones..."
  npx prisma migrate deploy
fi

if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Ejecutando seed..."
  node dist/prisma/seed/seed.js
fi

exec "$@"