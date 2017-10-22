import click
import flask
import inspect

from flask_marshmallow.sqla import ModelSchema
from flask_sqlalchemy import Model
from importlib import import_module

from backend.utils import title_case


def safe_import_module(module_name):
    """Like importlib's import_module, except it does not raise ImportError
    if the requested module_name was not found
    """
    try:
        return import_module(module_name)
    except ImportError as e:
        if module_name not in str(e):
            raise e


def get_members(module, predicate):
    """Like inspect.getmembers except predicate is passed both name and object
    """
    for name, obj in inspect.getmembers(module):
        if predicate(name, obj):
            yield (name, obj)


def is_extension(obj):
    # we want *instantiated* extensions, not imported extension classes
    return not inspect.isclass(obj) and hasattr(obj, 'init_app')


def get_extensions(import_names):
    """An iterable of (instance_name, extension_instance) tuples"""
    extension_modules = {}
    for import_name in import_names:
        module_name, extension_name = import_name.rsplit(':')

        if module_name not in extension_modules:
            module = import_module(module_name)
            extension_modules[module_name] = dict(
                inspect.getmembers(module, is_extension))

        extension_module = extension_modules[module_name]
        if extension_name in extension_module:
            yield extension_name, extension_module[extension_name]
        else:
            from warnings import warn
            warn('Could not find the {extension_name} extension in the '
                 '{module_name} module (did you forget to instantiate it?)'
                 ''.format(extension_name=extension_name,
                           module_name=module_name))


def is_blueprint(obj):
    return isinstance(obj, flask.Blueprint)


def is_click_command(obj):
    return isinstance(obj, click.Command) and not isinstance(obj, click.Group)


def is_click_group(obj):
    return isinstance(obj, click.Group)


def is_click_command_or_group(obj):
    return is_click_command(obj) or is_click_group(obj)


def get_commands():
    """An iterable of (command_name, command_fn) tuples"""
    from backend import commands
    existing_group_commands = {}
    for name, group in inspect.getmembers(commands, is_click_group):
        existing_group_commands.update(group.commands)
        if name not in commands.EXISTING_EXTENSION_GROUPS:
            yield (name, group)

    def _is_click_command(name, obj):
        return is_click_command(obj) and name not in existing_group_commands

    yield from get_members(commands, _is_click_command)


def is_model(name, obj):
    is_model_class = inspect.isclass(obj) and issubclass(obj, Model)
    base_classes = ('Model',)
    return is_model_class and name not in base_classes


def is_serializer(name, obj):
    is_model_schema = inspect.isclass(obj) and issubclass(obj, ModelSchema)
    base_classes = ('ModelSerializer', 'ModelSchema')
    return is_model_schema and name not in base_classes


sentinel = object()


class Bundle(object):
    module_name = None
    _label = None

    _views = 'views'
    _blueprint_names = sentinel
    _commands = 'commands'
    _models = 'models'
    _serializers = 'serializers'

    def __init__(self, module_name, label=None,
                 commands=sentinel,
                 command_group_name=None,
                 models=sentinel,
                 serializers=sentinel,
                 views=sentinel,
                 blueprint_names=sentinel,
                 ):
        self.module_name = module_name
        self._label = label

        if commands != sentinel:
            self._commands = commands
        self._command_group_name = command_group_name

        if models != sentinel:
            self._models = models

        if serializers != sentinel:
            self._serializers = serializers

        if views != sentinel:
            self._views = views
        self._blueprint_names = blueprint_names

    @property
    def _name(self):
        return self.module_name.rsplit('.')[1]

    @property
    def label(self):
        return self._label or title_case(self._name)


    @property
    def views_module_name(self):
        return self._get_full_module_name(self._views)

    @views_module_name.setter
    def views_module_name(self, views_module_name):
        self._views = self._normalize_module_name(views_module_name)

    @property
    def blueprint_names(self):
        if self._blueprint_names == sentinel:
            return [self._name]
        return self._blueprint_names

    @blueprint_names.setter
    def blueprint_names(self, blueprint_names):
        self._blueprint_names = blueprint_names

    @property
    def has_blueprints(self):
        if not self.views_module_name or not self.blueprint_names:
            return False
        return bool(safe_import_module(self.views_module_name))

    @property
    def blueprints(self):
        if not self.has_blueprints:
            yield StopIteration

        module = safe_import_module(self.views_module_name)
        blueprints = dict(inspect.getmembers(module, is_blueprint))
        for name in self.blueprint_names:
            yield blueprints[name]

    @property
    def commands_module_name(self):
        return self._get_full_module_name(self._commands)

    @commands_module_name.setter
    def commands_module_name(self, commands_module_name):
        self._commands = self._normalize_module_name(commands_module_name)

    @property
    def command_group_name(self):
        return self._command_group_name or self._name

    @command_group_name.setter
    def command_group_name(self, command_group_name):
        self._command_group_name = command_group_name

    @property
    def has_command_group(self):
        if not self.commands_module_name:
            return False
        return bool(safe_import_module(self.commands_module_name))

    @property
    def command_group(self):
        if not self.has_command_group:
            return None
        module = safe_import_module(self.commands_module_name)
        for name, command_group in inspect.getmembers(module, is_click_group):
            if name == self.command_group_name:
                return command_group

    @property
    def models_module_name(self):
        return self._get_full_module_name(self._models)

    @models_module_name.setter
    def models_module_name(self, models_module_name):
        self._models = self._normalize_module_name(models_module_name)

    @property
    def has_models(self):
        if not self.models_module_name:
            return False
        return bool(safe_import_module(self.models_module_name))

    @property
    def models(self):
        if self.has_models:
            module = safe_import_module(self.models_module_name)
            yield from get_members(module, is_model)

    @property
    def serializers_module_name(self):
        return self._get_full_module_name(self._serializers)

    @serializers_module_name.setter
    def serializers_module_name(self, serializers_module_name):
        self._serializers = self._normalize_module_name(serializers_module_name)

    @property
    def has_serializers(self):
        if not self.serializers_module_name:
            return False
        return bool(safe_import_module(self.serializers_module_name))

    @property
    def serializers(self):
        if self.has_serializers:
            module = safe_import_module(self.serializers_module_name)
            yield from get_members(module, is_serializer)

    def _get_full_module_name(self, module_name):
        if not module_name:
            return None
        return '{}.{}'.format(self.module_name, module_name)

    def _normalize_module_name(self, module_name):
        if not module_name:
            return None
        return module_name.replace(self.module_name, '').strip('.')


def is_bundle(obj):
    return not inspect.isclass(obj) and isinstance(obj, Bundle)


def get_bundles():
    from backend.config import BUNDLES

    for bundle_or_module_name in BUNDLES:
        if isinstance(bundle_or_module_name, Bundle):
            yield bundle_or_module_name.name, bundle_or_module_name
        else:
            bundle_found = False
            module = safe_import_module(bundle_or_module_name)
            for name, bundle in inspect.getmembers(module, is_bundle):
                bundle_found = True
                yield name, bundle
            if not bundle_found:
                from warnings import warn
                warn('Unable to find a Bundle instance for the {module_name} '
                     'module! Please create one in its __init__.py file.'
                     ''.format(module_name=bundle_or_module_name))
