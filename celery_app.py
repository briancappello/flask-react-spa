import os

# we import this here so celery can access it for its startup
from flask_unchained.bundles.celery import celery
from flask_unchained import AppFactory, PROD


app = AppFactory.create_app(os.getenv('FLASK_ENV', PROD))
app.app_context().push()
