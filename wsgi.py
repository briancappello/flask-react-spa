import os

from flask_unchained import AppFactory, PROD


app = AppFactory.create_app(os.getenv('FLASK_ENV', PROD))
