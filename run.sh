#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

DEV="docker compose -f docker-compose.yml"
BUILD="docker compose -f docker-compose.build.yml"

case "${1:-}" in
  --dev|-d)
    echo "==> Starting app in DEV mode (hot reload) ..."
    echo "    front: https://localhost:1420   back: https://localhost:8443"
    $DEV up -d
    ;;
  --build|-b)
    echo "==> Building app images..."
    $BUILD build
    echo "==> Starting app in BUILD mode ..."
    echo "    front: https://localhost:1420   back: https://localhost:8443"
    $BUILD up -d
    ;;
  --logs|-l)
    $BUILD logs -f --tail=100 "${2:-}"
    ;;
  --down|down)
    echo "==> Stopping containers..."
    $DEV down
    $BUILD down
    ;;
  --status)
    $DEV ps
    ;;
  *)
    echo "Usage:"
    echo "  ./run.sh --dev      launch front & back with hot reload"
    echo "  ./run.sh --build    build the app images then launch front & back"
    echo "  ./run.sh --logs     follow container logs"
    echo "  ./run.sh --down     stop all containers"
    echo "  ./run.sh --status   show running containers"
    exit 1
    ;;
esac
