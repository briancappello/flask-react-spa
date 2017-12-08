import os
import redis

from appdirs import AppDirs
from datetime import timedelta

from backend.utils.date import utcnow

APP_NAME = 'flask-react-spa'
app_dirs = AppDirs(APP_NAME)
APP_CACHE_FOLDER = app_dirs.user_cache_dir
APP_DATA_FOLDER = app_dirs.user_data_dir

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
TEMPLATE_FOLDER = os.path.join(PROJECT_ROOT, 'backend', 'templates')
STATIC_FOLDER = os.environ.get('FLASK_STATIC_FOLDER',
                               os.path.join(PROJECT_ROOT, 'static'))
STATIC_URL_PATH = '/static'  # serve asset files in static/ at /static/

# blog articles configuration
ARTICLES_FOLDER = os.path.join(PROJECT_ROOT, 'articles')
ARTICLE_PREVIEW_LENGTH = 400
FRONTMATTER_LIST_DELIMETER = ','
MARKDOWN_EXTENSIONS = ['extra']
DEFAULT_ARTICLE_AUTHOR_EMAIL = 'a@a.com'
SERIES_FILENAME = 'series.md'
ARTICLE_FILENAME = 'article.md'
ARTICLE_STYLESHEET_FILENAME = 'styles.css'

# list of bundle modules to register with the app, in dot notation
BUNDLES = [
    'backend.admin',
    'backend.blog',
    'backend.security',
    'backend.site',
]

# ordered list of extensions to register before the bundles
# syntax is import.name.in.dot.module.notation:extension_instance_name
EXTENSIONS = [
    'backend.extensions:session',               # should be first
    'backend.extensions:csrf',                  # should be second
    'backend.extensions:db',
    'backend.extensions:alembic',               # must come after db
    'backend.extensions.celery:celery',
    'backend.extensions.mail:mail',
    'backend.extensions.marshmallow:ma',        # must come after db
    'backend.extensions.security:security',     # must come after celery and mail
]

# list of extensions to register after the bundles
# syntax is import.name.in.dot.module.notation:extension_instance_name
DEFERRED_EXTENSIONS = [
    'backend.extensions.api:api',
    'backend.extensions.admin:admin',
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
# ROLE_POST_VIEW, ROLE_POST_EDIT, and ROLE_POST_DELETE roles.
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
    BUNDLES = BUNDLES

    ##########################################################################
    # session/cookies                                                        #
    ##########################################################################
    SESSION_TYPE = 'redis'
    SESSION_REDIS = redis.Redis(
        host=os.getenv('FLASK_REDIS_HOST', '127.0.0.1'),
        port=int(os.getenv('FLASK_REDIS_PORT', 6379)),
    )
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

    ALEMBIC = {
        'script_location': os.path.join(PROJECT_ROOT, 'migrations'),
    }

    ##########################################################################
    # celery                                                                 #
    ##########################################################################
    CELERY_BROKER_URL = 'redis://{host}:{port}/0'.format(
        host=os.getenv('FLASK_REDIS_HOST', '127.0.0.1'),
        port=os.getenv('FLASK_REDIS_PORT', 6379),
    )
    CELERY_RESULT_BACKEND = CELERY_BROKER_URL
    CELERY_ACCEPT_CONTENT = ('json', 'pickle')

    ##########################################################################
    # mail                                                                   #
    ##########################################################################
    MAIL_ADMINS = ('admin@example.com',)  # FIXME
    MAIL_SERVER = os.environ.get('FLASK_MAIL_HOST', 'localhost')
    MAIL_PORT = int(os.environ.get('FLASK_MAIL_PORT', 25))
    MAIL_USE_TLS = get_boolean_env('FLASK_MAIL_USE_TLS', False)
    MAIL_USE_SSL = get_boolean_env('FLASK_MAIL_USE_SSL', False)
    MAIL_USERNAME = os.environ.get('FLASK_MAIL_USERNAME', None)
    MAIL_PASSWORD = os.environ.get('FLASK_MAIL_PASSWORD', None)
    MAIL_DEFAULT_SENDER = (
        os.environ.get('FLASK_MAIL_DEFAULT_SENDER_NAME', 'Flask React SPA'),
        os.environ.get('FLASK_MAIL_DEFAULT_SENDER_EMAIL',
                       f"noreply@{os.environ.get('FLASK_DOMAIN', 'localhost')}")
    )

    ##########################################################################
    # security                                                               #
    ##########################################################################
    SECURITY_DATETIME_FACTORY = utcnow

    # specify which user field attributes can be used for login
    SECURITY_USER_IDENTITY_ATTRIBUTES = ['email', 'username']

    # NOTE: itsdangerous "salts" are not normal salts in the cryptographic
    # sense, see https://pythonhosted.org/itsdangerous/#the-salt
    SECURITY_PASSWORD_SALT = os.environ.get('FLASK_SECURITY_PASSWORD_SALT',
                                            'security-password-salt')

    # disable flask-security's use of .txt templates (instead we
    # generate the plain text from the html message)
    SECURITY_EMAIL_PLAINTEXT = False

    # enable forgot password functionality
    SECURITY_RECOVERABLE = True

    # enable email confirmation before allowing login
    SECURITY_CONFIRMABLE = True

    # this setting is parsed as a kwarg to timedelta, so the time unit must
    # always be plural
    SECURITY_CONFIRM_EMAIL_WITHIN = '7 days'  # default 5 days

    # urls for the *frontend* router
    SECURITY_CONFIRM_ERROR_VIEW = '/sign-up/resend-confirmation-email'
    SECURITY_POST_CONFIRM_VIEW = '/?welcome'


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
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{password}@{host}:{port}/{db_name}'.format(
        user=os.environ.get('FLASK_DATABASE_USER', 'flask_api'),
        password=os.environ.get('FLASK_DATABASE_PASSWORD', 'flask_api'),
        host=os.environ.get('FLASK_DATABASE_HOST', '127.0.0.1'),
        port=os.environ.get('FLASK_DATABASE_PORT', 5432),
        db_name=os.environ.get('FLASK_DATABASE_NAME', 'flask_api'),
    )
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

    WTF_CSRF_ENABLED = False
    SECURITY_PASSWORD_HASH_OPTIONS = dict(bcrypt={'rounds': 4})
    SECURITY__SEND_MAIL_TASK = None
