""" Flask Application Factory Pattern
http://flask.pocoo.org/docs/0.11/patterns/appfactories/

Conventions to follow for magic to ensue:

VIEWS, MODELS, and COMMANDS ("bundles")
-----------------------------
All views/models should be contained in bundle folders.
Views should be in a file named `views.py` containing the flask.Blueprint instance.
Models should be in a file named `models.py` and should extend database.Model
Commands should be in a file named `commands.py` containing a click.Group instance.
Finally, each bundle folder must be registered in `config.py`

EXTENSIONS
-----------------------------
All extensions should be instantiated in `extensions.py`

CLI COMMANDS
-----------------------------
Decorate custom CLI commands in `commands.py` using @cli.command()

FLASK SHELL CONTEXT
-----------------------------
Database models and app extensions will automatically be added to
the shell context, presuming the above conventions have been followed.
"""
import sys
from flask import Flask
from flask_wtf.csrf import generate_csrf

from .logger import logger
from .magic import (
    get_commands,
    get_extensions,
    get_bundle_blueprints,
    get_bundle_models,
    get_bundle_command_groups,
)


def create_app(config_object, **kwargs):
    """Application factory"""
    app = Flask(__name__, **kwargs)
    configure_app(app, config_object)
    extensions = dict(get_extensions())
    models = dict(get_bundle_models())
    register_extensions(app, extensions)
    register_blueprints(app)
    register_shell_context(app, extensions, models)
    register_cli_commands(app)
    return app


def configure_app(app, config_object):
    app.config.from_object(config_object)

    # set csrf_token cookie on every request
    def _set_csrf_cookie(response):
        if response:
            response.set_cookie('csrf_token', generate_csrf())
        return response
    app.after_request(_set_csrf_cookie)


def register_extensions(app, extensions):
    """Register and initialize extensions"""
    for extension in extensions.values():
        extension.init_app(app)


def register_blueprints(app):
    """Register bundle views"""
    # disable strict_slashes on all routes by default
    if not app.config.get('STRICT_SLASHES', False):
        app.url_map.strict_slashes = False
    # register blueprints
    for blueprint, url_prefix in get_bundle_blueprints():
        app.register_blueprint(blueprint, url_prefix=url_prefix)


def register_shell_context(app, extensions, models):
    """Register variables to automatically import when running `flask shell`"""
    def shell_context():
        # extensions
        ctx = extensions
        # DB models
        ctx.update(models)
        return ctx
    app.shell_context_processor(shell_context)


def register_cli_commands(app):
    """Register all the Click commands declared in commands.py and
    each bundle's commands.py"""
    commands = list(get_commands())
    commands += list(get_bundle_command_groups())
    for name, command in commands:
        if name in app.cli.commands:
            logger.error('Command name conflict: "%s" is taken.' % name)
            sys.exit(1)
        app.cli.add_command(command)
