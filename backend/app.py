"""
Flask Application Factory Pattern
http://flask.pocoo.org/docs/0.12/patterns/appfactories/
"""
import os
import sys

from flask import Flask as BaseFlask, session
from flask.helpers import get_debug_flag
from flask_wtf.csrf import generate_csrf

from .config import (
    BaseConfig,
    DevConfig,
    ProdConfig,
    PROJECT_ROOT,
    TEMPLATE_FOLDER,
    STATIC_FOLDER,
    STATIC_URL_PATH,
    EXTENSIONS,
    DEFERRED_EXTENSIONS,
)
from .logger import logger
from .magic import (
    get_bundles,
    get_commands,
    get_extensions,
)


class Flask(BaseFlask):
    bundles = []
    models = {}
    serializers = {}


def create_app():
    """Creates a pre-configured Flask application.

    Defaults to using :class:`backend.config.ProdConfig`, unless the
    :envvar:`FLASK_DEBUG` environment variable is explicitly set to "true",
    in which case it uses :class:`backend.config.DevConfig`. Also configures
    paths for the templates folder and static files.
    """
    return _create_app(
        DevConfig if get_debug_flag() else ProdConfig,
        template_folder=TEMPLATE_FOLDER,
        static_folder=STATIC_FOLDER,
        static_url_path=STATIC_URL_PATH
    )


def _create_app(config_object: BaseConfig, **kwargs):
    """Creates a Flask application.

    :param object config_object: The config class to use.
    :param dict kwargs: Extra kwargs to pass to the Flask constructor.
    """
    # WARNING: HERE BE DRAGONS!!!
    # DO NOT FUCK WITH THE ORDER OF THESE CALLS or nightmares will ensue
    app = Flask(__name__, **kwargs)
    app.bundles = list(get_bundles())
    configure_app(app, config_object)

    extensions = dict(get_extensions(EXTENSIONS))
    register_extensions(app, extensions)

    register_blueprints(app)
    register_models(app)
    register_serializers(app)
    register_admins(app)

    deferred_extensions = dict(get_extensions(DEFERRED_EXTENSIONS))
    extensions.update(deferred_extensions)
    register_extensions(app, deferred_extensions)

    register_cli_commands(app)
    register_shell_context(app, extensions)

    return app


def configure_app(app, config_object):
    """General application configuration:

    - register the app's config
    - register Jinja extensions
    - register functions to run on before/after request
    """
    # automatically configure a migrations folder for each bundle
    config_object.ALEMBIC['version_locations'] = [
        (bundle._name, os.path.join(PROJECT_ROOT,
                                    bundle.module_name.replace('.', os.sep),
                                    'migrations'))
        for bundle in app.bundles if bundle.has_models
    ]
    app.config.from_object(config_object)

    app.jinja_env.add_extension('jinja2_time.TimeExtension')

    @app.before_request
    def enable_session_timeout():
        session.permanent = True  # set session to use PERMANENT_SESSION_LIFETIME
        session.modified = True   # reset the session timer on every request

    @app.after_request
    def set_csrf_cookie(response):
        if response:
            response.set_cookie('csrf_token', generate_csrf())
        return response


def register_extensions(app, extensions):
    """Register and initialize extensions."""
    for extension in extensions.values():
        extension.init_app(app)


def register_blueprints(app):
    """Register bundle views."""
    # disable strict_slashes on all routes by default
    if not app.config.get('STRICT_SLASHES', False):
        app.url_map.strict_slashes = False

    # register blueprints
    for bundle in app.bundles:
        for blueprint in bundle.blueprints:
            # rstrip '/' off url_prefix because views should be declaring their
            # routes beginning with '/', and if url_prefix ends with '/', routes
            # will end up looking like '/prefix//endpoint', which is no good
            url_prefix = (blueprint.url_prefix or '').rstrip('/')
            app.register_blueprint(blueprint, url_prefix=url_prefix)


def register_models(app):
    """Register bundle models."""
    models = {}
    for bundle in app.bundles:
        for model_name, model_class in bundle.models:
            models[model_name] = model_class
    app.models = models


def register_admins(app):
    """Register bundle admins."""
    from backend.extensions import db
    from backend.extensions.admin import admin

    for bundle in app.bundles:
        if bundle.admin_icon_class:
            admin.category_icon_classes[bundle.admin_category_name] = bundle.admin_icon_class

        for ModelAdmin in bundle.model_admins:
            model_admin = ModelAdmin(ModelAdmin.model,
                                     db.session,
                                     category=bundle.admin_category_name,
                                     name=ModelAdmin.model.__plural_label__)

            # workaround upstream bug where certain values set as
            # class attributes get overridden by the constructor
            model_admin.menu_icon_value = getattr(ModelAdmin, 'menu_icon_value', None)
            if model_admin.menu_icon_value:
                model_admin.menu_icon_type = getattr(ModelAdmin, 'menu_icon_type', None)

            admin.add_view(model_admin)


def register_serializers(app):
    """Register bundle serializers."""
    serializers = {}
    for bundle in app.bundles:
        for name, serializer_class in bundle.serializers:
            serializers[name] = serializer_class
    app.serializers = serializers


def register_cli_commands(app):
    """Register all the Click commands declared in :file:`backend/commands` and
    each bundle's commands"""
    commands = list(get_commands())
    for bundle in app.bundles:
        commands += list(bundle.command_groups)
    for name, command in commands:
        if name in app.cli.commands:
            logger.error(f'Command name conflict: "{name}" is taken.')
            sys.exit(1)
        app.cli.add_command(command)


def register_shell_context(app, extensions):
    """Register variables to automatically import when running `python manage.py shell`."""
    def shell_context():
        ctx = {}
        ctx.update(extensions)
        ctx.update(app.models)
        ctx.update(app.serializers)
        return ctx
    app.shell_context_processor(shell_context)
