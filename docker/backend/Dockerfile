FROM python:alpine3.6

ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

RUN apk add --no-cache shadow
RUN useradd --user-group --create-home --home-dir /flask --shell /bin/false flask

RUN apk add --no-cache linux-headers make gcc musl-dev libxml2-dev libxslt-dev libffi-dev postgresql-dev

WORKDIR /flask/src

COPY ./requirements.txt requirements.txt
COPY ./requirements-dev.txt requirements-dev.txt
RUN pip install --no-cache-dir -r requirements-dev.txt
RUN pip install --no-cache-dir -r requirements.txt

USER flask

RUN mkdir -p /flask/.cache /flask/.local/share

COPY ./docker/backend/docs-entrypoint.sh /
COPY ./docker/backend/celery-beat-entrypoint.sh /
COPY ./docker/backend/celery-worker-entrypoint.sh /
COPY ./docker/backend/flask-entrypoint.sh /flask-entrypoint.sh
