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
            warn(f'Could not find the {extension_name} extension in the '
                 f'{module_name} module (did you forget to instantiate it?)')


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


def is_model_admin(name, obj):
    from backend.admin import ModelAdmin
    _is_model_admin = inspect.isclass(obj) and issubclass(obj, ModelAdmin)
    base_classes = ('ModelAdmin',)
    return _is_model_admin and name not in base_classes


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
    """
    A helper class for auto-registering a group of commands, views, models,
    serializers and admins with the app.

    Bundles are organized just as standard Python modules. If you want to
    customize any of the default names, you can do so in the constructor.

    Each bundle's modules are auto-detected if they exist, and will be
    registered if so. All are optional.

    Simple bundle example::

        $ tree
        backend/
        └── simple/
            ├── __init__.py
            ├── admins.py
            ├── commands.py
            ├── models.py
            ├── serializers.py
            └── views.py

    Big bundle example::

        $ tree
        backend/
        └── big/
            ├── __init__.py
            ├── admins
            │   ├── __init__.py  # must import all ModelAdmin(s)
            │   ├── one_admin.py
            │   └── two_admin.py
            ├── commands
            │   ├── __init__.py  # must import the click group from .group and
            │   │                # all commands
            │   ├── group.py     # the group should have the same name as the
            │   │                # bundle's folder, or to change it, pass
            │   │                # the command_group_names kwarg to Bundle
            │   ├── one.py
            │   └── two.py
            ├── models
            │   ├── __init__.py  # must import all Model(s)
            │   ├── one.py
            │   └── two.py
            ├── serializers
            │   ├── __init__.py  # must import all ModelSerializer(s)
            │   ├── one_serializer.py
            │   └── two_serializer.py
            └── views
                ├── __init__.py  # must import the Blueprint(s) from .blueprint
                │                # and all ModelResource(s)
                ├── blueprint.py # the blueprint should have the same name as the
                │                # bundle's folder, or to change it, pass the
                │                # blueprint_names kwarg to Bundle
                ├── one_resource.py
                └── two_resource.py

    In both cases, :file:`backend/<bundle_folder_name>/__init__.py` is the same::

        $ cat backend/<bundle_folder_name>/__init__.py
        from backend.magic import Bundle

        bundle = Bundle(__name__)

    Finally, the bundle modules must be registered in :file:`backend/config.py`::

        BUNDLES = [
            'backend.simple',
            'backend.big',
        ]

    :param str module_name: Top-level module name of the bundle (dot notation)
    :param str admin_category_name: Label to use for the bundle in the admin
    :param str admin_icon_class: Icon class to use for the bundle in the admin
    :param str admins_module_name: Folder or module name of the admins in the bundle
    :param str commands_module_name: Folder or module name of the commands in the bundle
    :param Iterable[str] command_group_names: List of the bundle's command group names. Defaults to [<bundle_folder_name>]
    :param str models_module_name: Folder or module name of the models in the bundle
    :param str serializers_module_name: Folder or module name of the serializers in the bundle
    :param str views_module_name: Folder or module name of the views in the bundle
    :param Iterable[str] blueprint_names: List of Blueprint name(s) to register. Defaults to [<bundle_folder_name>] (**NOTE**: names of the *instance variables*, not the Blueprints' endpoint names.)
    """
    module_name = None
    _admin_category_name = None
    admin_icon_class = None
    _admins_module_name = 'admins'
    _commands_module_name = 'commands'
    _command_group_names = sentinel
    _models_module_name = 'models'
    _serializers_module_name = 'serializers'
    _views_module_name = 'views'
    _blueprint_names = sentinel

    def __init__(self, module_name,
                 admin_category_name=None,
                 admin_icon_class=None,
                 admins_module_name=sentinel,
                 commands_module_name=sentinel,
                 command_group_names=sentinel,
                 models_module_name=sentinel,
                 serializers_module_name=sentinel,
                 views_module_name=sentinel,
                 blueprint_names=sentinel,
                 ):
        self.module_name = module_name

        self._admin_category_name = admin_category_name

        self.admin_icon_class = admin_icon_class

        if admins_module_name != sentinel:
            self._admins_module_name = self._normalize_module_name(admins_module_name)

        if commands_module_name != sentinel:
            self._commands_module_name = self._normalize_module_name(commands_module_name)

        self._command_group_names = command_group_names

        if models_module_name != sentinel:
            self._models_module_name = self._normalize_module_name(models_module_name)

        if serializers_module_name != sentinel:
            self._serializers_module_name = self._normalize_module_name(serializers_module_name)

        if views_module_name != sentinel:
            self._views_module_name = self._normalize_module_name(views_module_name)

        self._blueprint_names = blueprint_names

    @property
    def _name(self):
        return self.module_name.rsplit('.')[1]

    @property
    def admin_category_name(self):
        return self._admin_category_name or title_case(self._name)

    @property
    def admins_module_name(self):
        return self._get_full_module_name(self._admins_module_name)

    @property
    def has_admins(self):
        if not self.admins_module_name:
            return False
        return bool(safe_import_module(self.admins_module_name))

    @property
    def model_admins(self):
        if not self.has_admins:
            return ()

        admins_module = safe_import_module(self.admins_module_name)
        for name, obj in get_members(admins_module, is_model_admin):
            yield obj

    @property
    def views_module_name(self):
        return self._get_full_module_name(self._views_module_name)

    @property
    def blueprint_names(self):
        if self._blueprint_names != sentinel:
            return self._blueprint_names
        return [self._name]

    @property
    def has_blueprints(self):
        if not self.views_module_name or not self.blueprint_names:
            return False
        return bool(safe_import_module(self.views_module_name))

    @property
    def blueprints(self):
        if not self.has_blueprints:
            return ()

        module = safe_import_module(self.views_module_name)
        blueprints = dict(inspect.getmembers(module, is_blueprint))
        for name in self.blueprint_names:
            yield blueprints[name]

    @property
    def commands_module_name(self):
        return self._get_full_module_name(self._commands_module_name)

    @property
    def command_group_names(self):
        if self._command_group_names != sentinel:
            return self._command_group_names
        return [self._name]

    @property
    def has_command_groups(self):
        if not self.commands_module_name or not self.command_group_names:
            return False
        return bool(safe_import_module(self.commands_module_name))

    @property
    def command_groups(self):
        if not self.has_command_groups:
            return ()

        module = safe_import_module(self.commands_module_name)
        command_groups = dict(inspect.getmembers(module, is_click_group))
        for name in self.command_group_names:
            yield name, command_groups[name]

    @property
    def models_module_name(self):
        return self._get_full_module_name(self._models_module_name)

    @property
    def has_models(self):
        if not self.models_module_name:
            return False
        return bool(safe_import_module(self.models_module_name))

    @property
    def models(self):
        if not self.has_models:
            return ()

        module = safe_import_module(self.models_module_name)
        yield from get_members(module, is_model)

    @property
    def serializers_module_name(self):
        return self._get_full_module_name(self._serializers_module_name)

    @property
    def has_serializers(self):
        if not self.serializers_module_name:
            return False
        return bool(safe_import_module(self.serializers_module_name))

    @property
    def serializers(self):
        if not self.has_serializers:
            return ()

        module = safe_import_module(self.serializers_module_name)
        yield from get_members(module, is_serializer)

    def _get_full_module_name(self, module_name):
        if not module_name:
            return None
        return f'{self.module_name}.{module_name}'

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
            yield bundle_or_module_name
        else:
            bundle_found = False
            module = safe_import_module(bundle_or_module_name)
            for name, bundle in inspect.getmembers(module, is_bundle):
                bundle_found = True
                yield bundle
            if not bundle_found:
                from warnings import warn
                warn('Unable to find a Bundle instance for the '
                     f'{bundle_or_module_name} module! '
                     'Please create one in its __init__.py file.')
