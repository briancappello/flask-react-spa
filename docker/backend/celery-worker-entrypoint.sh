#!/bin/sh

celery worker -A wsgi.celery -l info
