import os
from datetime import timedelta

APP_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))

TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, 'frontend')
STATIC_FOLDER = os.path.join(PROJECT_ROOT, 'frontend', 'dist')
STATIC_URL_PATH = '/static'  # serve asset files in frontend/dist/ at /static/

# blueprint folders to register with the app
BLUEPRINTS = {
    # backend.folder: url_prefix
    'backend.site': '/',
    'backend.auth': '/auth',
    'backend.api': '/api/v1',
}


class BaseConfig(object):
    SECRET_KEY = os.environ.get('FLASK_API_SECRET_KEY', 'not-secret-key')  # FIXME
    BCRYPT_LOG_ROUNDS = 13
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    STRICT_SLASHES = False

    JWT_AUTH_URL_RULE = '/auth'
    JWT_AUTH_URL_OPTIONS = {
        'methods': ['POST'],
        'strict_slashes': STRICT_SLASHES
    }
    JWT_EXPIRATION_DELTA = timedelta(days=1)
    JWT_AUTH_USERNAME_KEY = 'username'
    JWT_AUTH_PASSWORD_KEY = 'password'


class ProdConfig(BaseConfig):
    ENV = 'prod'
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'postgresql://user:pw@localhost/db_name'  # FIXME


class DevConfig(BaseConfig):
    ENV = 'dev'
    DEBUG = True
    DB_NAME = 'dev.sqlite'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///%s' % os.path.join(PROJECT_ROOT, DB_NAME)


class TestConfig(BaseConfig):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'  # :memory:
    BCRYPT_LOG_ROUNDS = 4
