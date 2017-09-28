import click
import flask
import inspect
from importlib import import_module
from flask_marshmallow.sqla import ModelSchema
from flask_sqlalchemy import Model

from .config import BUNDLES
from . import commands


def safe_import_module(module_name):
    """Like importlib's import_module, except it does not raise ImportError
    if the requested module_name was not found
    """
    try:
        return import_module(module_name)
    except ImportError as e:
        if module_name not in str(e):
            raise e


def get_extensions(import_names):
    """An iterable of (instance_name, extension_instance) tuples"""
    def is_extension(obj):
        # we want *instantiated* extensions, not imported extension classes
        return not inspect.isclass(obj) and hasattr(obj, 'init_app')

    module_extensions = {}
    for import_name in import_names:
        module_name, extension_name = import_name.rsplit(':')

        if module_name not in module_extensions:
            module = import_module(module_name)
            module_extensions[module_name] = dict(
                inspect.getmembers(module, is_extension))

        members = module_extensions[module_name]
        if extension_name in members:
            yield extension_name, members[extension_name]
        else:
            from warnings import warn
            singular = len(members) == 1
            warn('Could not find the %s extension%s in the %s module'
                 ' (did you forget to instantiate %s?)' % (
                    ', '.join(members),
                    '' if singular else 's',
                    module_name,
                    'it' if singular else 'them',
                 ))


def get_bundle_blueprints():
    """An iterable of (blueprint_instance, url_prefix) tuples"""
    for bundle in BUNDLES:
        module = safe_import_module('{}.views'.format(bundle))
        if not module:
            continue

        def is_bundle_blueprint(obj):
            is_bp = isinstance(obj, flask.Blueprint)
            return is_bp and obj.import_name.startswith(module.__name__)

        for name, blueprint in inspect.getmembers(module, is_bundle_blueprint):
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
        module = safe_import_module('{}.serializers'.format(bundle))
        if not module:
            continue

        yield from _get_members(module, is_serializer)


def get_bundle_models():
    """An iterable of (ModelClassName, ModelClass) tuples"""
    def is_model_class(name, obj):
        return inspect.isclass(obj) and issubclass(obj, Model) and name != 'Model'

    for bundle in BUNDLES:
        module = safe_import_module('{}.models'.format(bundle))
        if not module:
            continue

        yield from _get_members(module, is_model_class)


def is_click_group(obj):
    return isinstance(obj, click.Group)


def get_commands():
    """An iterable of (command_name, command_fn) tuples"""
    existing_group_commands = {}
    for name, group in inspect.getmembers(commands, is_click_group):
        if name not in ['cli', 'db_cli']:
            existing_group_commands.update(group.commands)
            yield (name, group)

    def is_click_command(name, obj):
        is_command = isinstance(obj, click.Command) and not is_click_group(obj)
        return is_command and name not in existing_group_commands

    yield from _get_members(commands, is_click_command)


def get_bundle_command_groups():
    """An iterable of (group_name, group_instance) tuples"""
    for bundle in BUNDLES:
        module = safe_import_module('{}.commands'.format(bundle))
        if not module:
            continue

        # only load top-level groups
        # inspect.getmembers is sadly ordered alphabetically, as opposed to
        # declaration order, so we need to loop twice
        members = inspect.getmembers(module, is_click_group)
        nested_commands = {}
        for name, group in members:
            nested_commands.update(group.commands)
        for name, group in members:
            if name not in nested_commands:
                yield (name, group)


def _get_members(module, predicate):
    """Like inspect.getmembers except predicate is passed both name and object"""
    for name, obj in inspect.getmembers(module):
        if predicate(name, obj):
            yield (name, obj)
