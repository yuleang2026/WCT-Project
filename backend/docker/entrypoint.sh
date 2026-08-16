#!/bin/sh
set -e

case "$*" in
    *artisan\ serve*)
        php artisan migrate --force
        php artisan storage:link || true
        php artisan config:cache
        php artisan route:cache
        ;;
esac

exec "$@"
