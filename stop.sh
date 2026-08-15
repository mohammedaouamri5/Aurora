#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

DEV="docker compose -f docker-compose.yml"
BUILD="docker compose -f docker-compose.build.yml"

echo "==> Stopping containers..."
$DEV stop
$BUILD stop
echo "==> Done."
