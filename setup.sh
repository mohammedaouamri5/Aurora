#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

echo "==> Aurora docker setup"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: docker compose (v2) is not available."
  exit 1
fi

case "${1:-dev}" in
  dev)
    echo "==> Pulling base images for dev (hot reload)..."
    docker pull golang:1.25
    docker pull node:22
    echo "==> Pulling infra + app images..."
    docker compose pull
    ;;
  build)
    echo "==> Pulling infra images..."
    docker compose -f docker-compose.build.yml pull
    echo "==> Building app images..."
    docker compose -f docker-compose.build.yml build
    ;;
  *)
    echo "Usage: ./setup.sh [dev|build]"
    echo "  dev    prepare the hot-reload dev environment (default)"
    echo "  build  pull infra images and build the app images"
    exit 1
    ;;
esac

docker compose config -q
echo "==> Setup done."
