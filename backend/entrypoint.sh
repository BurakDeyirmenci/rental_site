#!/bin/sh

# Veritabanının hazır olup olmadığını kontrol et
until pg_isready -h ${POSTGRES_HOST} -U ${POSTGRES_USER} -p ${POSTGRES_PORT} -d ${POSTGRES_DB}; do
  >&2 echo "Veritabanı hazır değil - bekleniyor..."
  sleep 2
done

>&2 echo "Veritabanı hazır."

# Django migrasyonlarını çalıştır
python manage.py makemigrations
python manage.py migrate

# Uygulamayı başlat
exec "$@"
