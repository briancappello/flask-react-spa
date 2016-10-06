import click
import flask
import inspect
from importlib import import_module

from .config import BLUEPRINTS
from . import commands, extensions


def get_extensions():
    """An iterable of (extension_name, extension_instance) tuples"""
    def is_extension(obj):
        # we want _instantiated_ extensions, not extension classes
        return not inspect.isclass(obj) and hasattr(obj, 'init_app')
    return inspect.getmembers(extensions, is_extension)


def get_blueprints():
    """An iterable of (blueprint_instance, url_prefix) tuples"""
    def is_blueprint(obj):
        return isinstance(obj, flask.Blueprint)

    for bp, url_prefix in BLUEPRINTS.items():
        # rstrip '/' off url_prefix because blueprints should be declaring their
        # endpoints beginning with '/', and if url_prefix ends with '/', routes
        # will end up looking like '/prefix//endpoint', which is no good
        url_prefix = (url_prefix or '').rstrip('/')
        bp_views = '%s.views' % bp
        try:
            views_module = import_module(bp_views)
        except ImportError:
            continue  # allow blueprints without any views

        for _, blueprint in inspect.getmembers(views_module, is_blueprint):
            yield (blueprint, url_prefix)


def get_models():
    """An iterable of (ModelName, ModelClass) tuples"""
    from .database import db  # must import here to avoid circular deps

    def is_model_class(name, obj):
        return inspect.isclass(obj) and issubclass(obj, db.Model) and name != 'Model'

    for bp, _ in BLUEPRINTS.items():
        bp_models = '%s.models' % bp
        try:
            models_module = import_module(bp_models)
        except ImportError:
            continue  # allow blueprints without any models

        for name, model in _get_members(models_module, is_model_class):
            yield (name, model)


def get_commands():
    """An iterable of (command_name, command_instance) tuples"""
    def is_click_command(obj):
        return isinstance(obj, click.Command) and not isinstance(obj, click.Group)
    return inspect.getmembers(commands, is_click_command)


def get_blueprint_command_groups():
    """An iterable of (group_name, group_instance) tuples"""
    def is_click_group(obj):
        return isinstance(obj, click.Group)

    for bp, _ in BLUEPRINTS.items():
        bp_commands = '%s.commands' % bp
        try:
            commands_module = import_module(bp_commands)
        except ImportError:
            continue  # allow blueprints without any commands

        for name, group in inspect.getmembers(commands_module, is_click_group):
            yield (name, group)


def _get_members(module, predicate):
    """Like inspect.getmembers except predicate is passed both name and object"""
    for name, obj in inspect.getmembers(module):
        if predicate(name, obj):
            yield (name, obj)
