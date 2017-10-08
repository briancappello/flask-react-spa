#!/bin/sh

test -e backend/config.py || (
   echo "WARNING: config.py not found, using default" &&\
   cp backend/config.example.py backend/config.py
)

until python3 manage.py db fixtures fixtures.json --reset
do
    echo "Waiting for postgres ready..."
    sleep 2
done

test -e /flask/.cache/flask-react-spa/.articles-metadata.json &&\
   rm /flask/.cache/flask-react-spa/.articles-metadata.json
python3 manage.py blog import_articles
python3 manage.py run --host 0.0.0.0 --port 5000
