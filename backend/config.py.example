import os
import datetime

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

    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=15)

    SESSION_PROTECTION = 'strong'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_PATH = '/api/'


class ProdConfig(BaseConfig):
    ENV = 'prod'
    DEBUG = False

    SESSION_COOKIE_SECURE = True  # only send cookies over https
    SESSION_COOKIE_DOMAIN = 'www.example.com'  # FIXME
    SQLALCHEMY_DATABASE_URI = 'postgresql://user:pw@localhost/db_name'  # FIXME


class DevConfig(BaseConfig):
    ENV = 'dev'
    DEBUG = True
    DB_NAME = 'dev.sqlite'
    # SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///%s' % os.path.join(PROJECT_ROOT, DB_NAME)


class TestConfig(BaseConfig):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'  # :memory:
    BCRYPT_LOG_ROUNDS = 4
