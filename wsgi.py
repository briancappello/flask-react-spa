from backend.app import create_app

# we import this here so celery can access it for its startup
from backend.extensions.celery import celery

app = create_app()
