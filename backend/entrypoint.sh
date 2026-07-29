#!/bin/sh
set -e

until pg_isready \
    -h "${POSTGRES_HOST}" \
    -U "${POSTGRES_USER}" \
    -p "${POSTGRES_PORT}" \
    -d "${POSTGRES_DB}"
do
    echo "Veritabani hazir degil, bekleniyor..."
    sleep 2
done

echo "Veritabani hazir."

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
