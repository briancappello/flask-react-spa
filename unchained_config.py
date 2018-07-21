import os

project_root = os.path.abspath(os.path.dirname(__file__))


def folder_or_none(folder_name):
    if not os.path.exists(os.path.join(project_root, folder_name)):
        return None
    return folder_name


# these get passed to the Flask constructor
TEMPLATE_FOLDER = folder_or_none('templates')
STATIC_FOLDER = folder_or_none('static')
STATIC_URL_PATH = '/static' if STATIC_FOLDER else None

BUNDLES = [
    'flask_admin_bundle',
    'flask_api_bundle',
    'flask_mail_bundle',
    'flask_celery_bundle',
    'flask_unchained.bundles.session',
    'flask_sqlalchemy_bundle',

    'bundles.blog',
    'bundles.security',
    'backend',
]
