#!/bin/sh
set -e

echo "=> Ejecutando migraciones de Prisma..."
# prisma migrate deploy aplica las migraciones a la base de datos sin preguntar ni borrar datos.
# Ideal para entornos donde la base de datos acaba de ser creada en Dockploy.
pnpm prisma migrate deploy

# Ejecutar el seed solo si estamos en ambiente de desarrollo
if [ "$NODE_ENV" = "development" ] || [ "$NODE_ENV" = "dev" ]; then
    echo "=> Entorno de desarrollo detectado."
    echo "=> Ejecutando seed de la base de datos..."
    # Usamos tsx para ejecutar TypeScript directamente sin requerir ts-node o typescript (que fueron removidos en el prune de prod)
    pnpm dlx tsx prisma/seed/seed.ts
else
    echo "=> Entorno de producción detectado. Saltando seed de desarrollo..."
fi

echo "=> Iniciando la aplicación..."
exec "$@"
