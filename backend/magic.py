import click
import flask
import inspect
from importlib import import_module
from flask_marshmallow.sqla import ModelSchema
from flask_sqlalchemy import Model

from .config import BUNDLES, DEFERRED_EXTENSIONS
from . import commands, extensions


def get_extensions():
    """An iterable of (extension_instance_name, extension_instance) tuples"""
    return _get_extensions(deferred=False)


def get_deferred_extensions():
    """An iterable of (extension_instance_name, extension_instance) tuples"""
    return _get_extensions(deferred=True)


def _get_extensions(deferred):
    """An iterable of (extension_instance_name, extension_instance) tuples"""
    def is_extension(obj):
        # we want *instantiated* extensions, not imported extension classes
        return not inspect.isclass(obj) and hasattr(obj, 'init_app')

    for name, extension in inspect.getmembers(extensions, is_extension):
        yield_deferred = deferred and name in DEFERRED_EXTENSIONS
        yield_not_deferred = not deferred and name not in DEFERRED_EXTENSIONS
        if yield_deferred or yield_not_deferred:
            yield (name, extension)


def get_bundle_blueprints():
    """An iterable of (blueprint_instance, url_prefix) tuples"""

    for bundle in BUNDLES:
        module_name = '{}.views'.format(bundle)
        try:
            views_module = import_module(module_name)
        except ImportError:
            continue  # allow bundles without any views

        def is_blueprint(obj):
            return isinstance(obj, flask.Blueprint) and obj.import_name == module_name

        for name, blueprint in inspect.getmembers(views_module, is_blueprint):
            # rstrip '/' off url_prefix because views should be declaring their
            # routes beginning with '/', and if url_prefix ends with '/', routes
            # will end up looking like '/prefix//endpoint', which is no good
            url_prefix = (blueprint.url_prefix or '').rstrip('/')
            yield (blueprint, url_prefix)


def get_bundle_serializers():
    """An iterable of (SerializerClassName, SerializerClass) tuples"""
    def is_serializer(name, obj):
        return inspect.isclass(obj) and issubclass(obj, ModelSchema) and name not in ['ModelSerializer', 'ModelSchema']

    for bundle in BUNDLES:
        try:
            serializers_module = import_module('{}.serializers'.format(bundle))
        except ImportError:
            continue  # allow bundles without any serializers

        for name, serializer in _get_members(serializers_module, is_serializer):
            yield (name, serializer)


def get_bundle_models():
    """An iterable of (ModelClassName, ModelClass) tuples"""
    def is_model_class(name, obj):
        return inspect.isclass(obj) and issubclass(obj, Model) and name != 'Model'

    for bundle in BUNDLES:
        try:
            models_module = import_module('{}.models'.format(bundle))
        except ImportError:
            continue  # allow bundles without any models

        for name, model in _get_members(models_module, is_model_class):
            yield (name, model)


def is_click_group(obj):
    return isinstance(obj, click.Group)


def get_commands():
    """An iterable of (command_name, command_fn) tuples"""
    def is_click_command(obj):
        return isinstance(obj, click.Command) and not is_click_group(obj)
    return inspect.getmembers(commands, is_click_command)


def get_extra_command_groups():
    for name, group in inspect.getmembers(commands, is_click_group):
        if name not in ['cli', 'db_cli']:
            yield (name, group)


def get_bundle_command_groups():
    """An iterable of (group_name, group_instance) tuples"""
    for bundle in BUNDLES:
        try:
            commands_module = import_module('{}.commands'.format(bundle))
        except ImportError:
            continue  # allow bundles without any commands

        for name, group in inspect.getmembers(commands_module, is_click_group):
            yield (name, group)


def _get_members(module, predicate):
    """Like inspect.getmembers except predicate is passed both name and object"""
    for name, obj in inspect.getmembers(module):
        if predicate(name, obj):
            yield (name, obj)
