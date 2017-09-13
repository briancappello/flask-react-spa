import os
from datetime import timedelta

APP_DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(APP_DIR, os.pardir))

TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, 'frontend')
STATIC_FOLDER = os.path.join(PROJECT_ROOT, 'static')
STATIC_URL_PATH = '/static'  # serve asset files in static/ at /static/

# bundle folders to register with the app, in python module dot notation
BUNDLES = [
    'backend.site',
    'backend.auth',
    'backend.api',
]

# normally extensions are registered before the bundles (views, models & serializers)
# this is a list of extensions to register _after_ the bundles
# NOTE: these must be the names of extension _instances_ (not extension class names)
DEFERRED_EXTENSIONS = [
    'api',
]

# Declare role inheritances
# Keys here correspond to roles a user explicitly has (as set in the database).
# Values should be a list of "inherited" roles. There is also a special flag,
# __CRUD__, which expands into the standard CREATE, VIEW, EDIT and DELETE roles.
# Role inheritances are loaded recursively, so, for example given the following:
# ROLE_HIERARCHY = {
#     'ROLE_ADMIN': ['ROLE_USER'],
#     'ROLE_USER': ['ROLE_POST'],
#     'ROLE_POST': ['__CRUD__'],
#     'ROLE_GUEST': ['ROLE_POST_VIEW']
# }
# Then ROLE_ADMIN users will also get ROLE_USER, ROLE_POST, ROLE_POST_CREATE,
#  ROLE_POST_VIEW, ROLE_POST_EDIT, and ROLE_POST_DELETE roles.
# Likewise, ROLE_USER users will inherit the ROLE_POST, ROLE_POST_CREATE,
# ROLE_POST_VIEW, ROLE_POST_EDIT, and ROLE_POST_DELETE roles.
# However, ROLE_GUEST users will only inherit the ROLE_POST_VIEW role. (note
# that if you want unauthenticated users to have the ROLE_GUEST role, you'll
# need to implement and register a custom AnonymousUser class)
ROLE_HIERARCHY = {
    'ROLE_ADMIN': ['ROLE_USER'],
}


def get_boolean_env(name, default):
    default = 'true' if default else 'false'
    return os.getenv(name, default).lower() in ['true', 'yes', '1']


class BaseConfig(object):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    DEBUG = get_boolean_env('FLASK_DEBUG', False)
    SECRET_KEY = os.environ.get('FLASK_SECRET_KEY', 'not-secret-key')  # FIXME
    STRICT_SLASHES = False

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_TYPE = 'redis'
    SESSION_PROTECTION = 'strong'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_HTTPONLY = True

    # SECURITY_TOKEN_MAX_AGE is fixed from time of token generation;
    # it does not update on refresh like a session timeout would. for that,
    # we set (the ironically named) PERMANENT_SESSION_LIFETIME
    PERMANENT_SESSION_LIFETIME = timedelta(minutes=60)

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ##########################################################################
    # celery                                                                 #
    ##########################################################################
    CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'
    CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/0'
    CELERY_ACCEPT_CONTENT = ('json', 'pickle')

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_SERVER = os.environ.get('FLASK_MAIL_HOST', 'localhost')
    MAIL_PORT = int(os.environ.get('FLASK_MAIL_PORT', 25))
    MAIL_USE_TLS = get_boolean_env('FLASK_MAIL_USE_TLS', False)
    MAIL_USE_SSL = get_boolean_env('FLASK_MAIL_USE_SSL', False)
    MAIL_USERNAME = os.environ.get('FLASK_MAIL_USERNAME', None)
    MAIL_PASSWORD = os.environ.get('FLASK_MAIL_PASSWORD', None)
    MAIL_DEFAULT_SENDER = (
        os.environ.get('FLASK_MAIL_DEFAULT_SENDER_NAME', 'Flask React API'),
        os.environ.get('FLASK_MAIL_DEFAULT_SENDER_EMAIL',
                       'noreply@%s' % os.environ.get('FLASK_DOMAIN', 'localhost'))
    )

    ##########################################################################
    # security                                                               #
    ##########################################################################
    # specify which user field attributes can be used for login
    SECURITY_USER_IDENTITY_ATTRIBUTES = ['email', 'username']

    # enable email confirmation before allowing login
    SECURITY_CONFIRMABLE = True
    # parsed as a kwarg to timedelta, so the time unit must always be plural
    SECURITY_CONFIRM_EMAIL_WITHIN = '7 days'  # default 5 days

    # enable forgot password functionality
    SECURITY_RECOVERABLE = True

    # NOTE: itsdangerous "salts" are not normal salts in the cryptographic
    # sense, see https://pythonhosted.org/itsdangerous/#the-salt
    SECURITY_PASSWORD_SALT = os.environ.get('FLASK_SECURITY_PASSWORD_SALT',
                                            'security-password-salt')


class ProdConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    ENV = 'prod'
    DEBUG = get_boolean_env('FLASK_DEBUG', False)

    ##########################################################################
    # database                                                               #
    ##########################################################################
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}'.format(
        user=os.environ.get('FLASK_DATABASE_USER', 'flask_api'),
        password=os.environ.get('FLASK_DATABASE_PASSWORD', 'flask_api'),
        host=os.environ.get('FLASK_DATABASE_HOST', '127.0.0.1'),
        port=os.environ.get('FLASK_DATABASE_PORT', 5432),
        db_name=os.environ.get('FLASK_DATABASE_NAME', 'flask_api'),
    )

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_DOMAIN = os.environ.get('FLASK_DOMAIN', 'example.com')  # FIXME
    SESSION_COOKIE_SECURE = get_boolean_env('SESSION_COOKIE_SECURE', True)


class DevConfig(BaseConfig):
    ##########################################################################
    # flask                                                                  #
    ##########################################################################
    ENV = 'dev'
    DEBUG = get_boolean_env('FLASK_DEBUG', True)
    # EXPLAIN_TEMPLATE_LOADING = True

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_COOKIE_SECURE = False

    ##########################################################################
    # database                                                               #
    ##########################################################################
    DB_NAME = 'dev.sqlite'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///%s' % os.path.join(PROJECT_ROOT, DB_NAME)
    # SQLALCHEMY_ECHO = True

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_PORT = 1025  # MailHog
    MAIL_DEFAULT_SENDER = ('Flask React SPA', 'noreply@localhost')

    ##########################################################################
    # security                                                               #
    ##########################################################################
    SECURITY_CONFIRMABLE = True
    SECURITY_CONFIRM_EMAIL_WITHIN = '1 minutes'  # for testing


class TestConfig(BaseConfig):
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'  # :memory:
