#!/bin/sh
set -e

echo "--- Waiting for postgres..."
while ! pg_isready -h postgres -U "$DATABASE_USERNAME" >/dev/null 2>&1; do
  sleep 1
done
echo "--- Postgres is ready"

echo "--- Waiting for minio..."
while ! curl -fsS "http://minio:9000/minio/health/ready" >/dev/null 2>&1; do
  sleep 1
done
echo "--- MinIO is ready"

echo "--- Ensuring MinIO bucket exists..."
mc alias set local "http://minio:9000" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD" >/dev/null 2>&1 || true
mc mb -p "local/${MINIO_BUCKET:-ai-picture}" >/dev/null 2>&1 || true
mc anonymous set download "local/${MINIO_BUCKET:-ai-picture}" >/dev/null 2>&1 || true

echo "--- Running Prisma migrations..."
cd /app
bun run --cwd packages/db prisma migrate deploy
bun run --cwd packages/db prisma generate

echo "--- Starting web..."
exec bun run --cwd apps/web dev
