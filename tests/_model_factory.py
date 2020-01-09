import datetime
import os
import re
import yaml

from collections import defaultdict, namedtuple
from faker import Faker
from jinja2 import Environment, PackageLoader
from sqlalchemy.ext.associationproxy import AssociationProxy
from backend.database import Date, DateTime

from backend.utils.date import parse_datetime, utcnow

identifier_re = re.compile('(?P<class_name>\w+)\((?P<identifiers>[\w,\s]+)\)')
Identifier = namedtuple('Identifier', 'class_name id')


class AttrGetter:
    def __init__(self, dict_):
        self.dict_ = dict_

    def __getattr__(self, name):
        return self.dict_[name]


class ModelFactory:
    env = None
    loaded_class_names = set()
    class_name_lookup = {}
    model_fixtures = {}  # raw data from yaml files

    def __init__(self, session, model_classes, fixtures_dir):
        self.session = session
        self.model_classes = model_classes
        self.fixtures_dir = fixtures_dir
        self.model_instances = {}

    def get_models(self, identifiers):
        return AttrGetter(self.create_all(identifiers))

    def create_all(self, identifiers):
        identifiers = flatten_identifiers(identifiers)
        models = {identifier.id: self._create(identifier)
                  for identifier in identifiers}
        self.session.commit()
        return models

    def create(self, class_name_or_identifier, identifier=None):
        if identifier:
            identifier = Identifier(class_name_or_identifier, identifier)
        else:
            identifier = _convert_str(class_name_or_identifier)[0]
        model = self._create(identifier)
        self.session.commit()
        return model

    def _create(self, identifier):
        if not identifier.class_name:
            raise Exception('Identifier must have a class name!')
        self._maybe_load_data([identifier])

        model_class = self.model_classes[identifier.class_name]
        instance = self.model_instances.get(identifier.id)
        if isinstance(instance, model_class) and instance in self.session:
            return instance

        data = self.model_fixtures[identifier.id]
        instance = model_class(**self.maybe_convert_values(model_class, data))
        self.session.add(instance)
        self.model_instances[identifier.id] = instance
        return instance

    def maybe_convert_values(self, model_class, data):
        ret = data.copy()
        for col_name, value in data.items():
            col = getattr(model_class, col_name)
            if isinstance(col, AssociationProxy) or col.impl.uses_objects:
                ret[col_name] = self.convert_identifiers(value)
            elif not hasattr(col, 'type'):
                continue
            elif isinstance(col.type, Date):
                if value in ('today', 'now', 'utcnow'):
                    ret[col_name] = utcnow().date
                else:
                    ret[col_name] = parse_datetime(value).date
            elif isinstance(col.type, DateTime):
                if value in ('now', 'utcnow'):
                    ret[col_name] = utcnow()
                elif not isinstance(value, datetime.datetime):
                    ret[col_name] = parse_datetime(value)
        return ret

    def convert_identifiers(self, identifiers):
        if isinstance(identifiers, list):
            return [self._create(identifier)
                    for identifier in flatten_identifiers(identifiers)]
        return self.convert_identifier(identifiers)

    def convert_identifier(self, identifier):
        result = [self._create(identifier)
                  for identifier in flatten_identifiers(identifier)]
        return result[0] if len(result) == 1 else result

    def _maybe_load_data(self, identifiers):
        class_names = {class_name for class_name, _ in identifiers}
        class_names = class_names.difference(self.loaded_class_names)
        if not class_names:
            return

        for filename in os.listdir(self.fixtures_dir):
            path = os.path.join(self.fixtures_dir, filename)
            if os.path.isfile(path):
                class_name = filename[:filename.rfind('.')]
                if None in class_names or class_name in class_names:
                    self._load_from_yaml(filename)
                    self.loaded_class_names.add(class_name)

    def _load_from_yaml(self, filename):
        if not self.env:
            self.env = Environment(loader=PackageLoader('tests',
                                                        'model_fixtures'))
            faker = Faker()
            faker.seed_instance(1234)
            self.env.globals['faker'] = faker

        template = self.env.get_template(filename)
        fixture_data = yaml.load(template.render(), Loader=yaml.FullLoader)

        class_name = filename[:filename.rfind('.')]
        for identifier_id, data in fixture_data.items():
            # FIXME check for dups
            self.class_name_lookup[identifier_id] = class_name
            self.model_fixtures[identifier_id] = data


def flatten_identifiers(identifiers):
    if isinstance(identifiers, str):
        identifiers = _convert_str(identifiers)
    if isinstance(identifiers, (list, tuple)):
        identifiers = _group_by_class_name(identifiers)

    ret = []
    for class_name, values in identifiers.items():
        for identifier in _flatten_csv_list(values):
            ret.append(Identifier(class_name, identifier))
    return ret


def _group_by_class_name(identifiers):
    ret = defaultdict(list)
    for v in identifiers:
        if isinstance(v, Identifier):
            ret[v.class_name].append(v.id)
        elif isinstance(v, str):
            for identifier in _convert_str(v):
                ret[identifier.class_name].append(identifier.id)
        else:
            raise Exception(f'Unexpected value {type(v)}')
    return ret


def _flatten_csv_list(identifiers):
    if isinstance(identifiers, str):
        identifiers = _convert_str(identifiers)
    return [identifier.strip()
            for items in identifiers
            for identifier in items.split(',')]


def _convert_str(value):
    ret = []
    prev = None
    while True:
        match = identifier_re.search(value, prev.end() if prev else 0)
        if not match and not ret:
            return [Identifier(None, value)]
        elif not match:
            return ret

        ret.append(Identifier(match.group('class_name'), match.group('identifiers')))
        prev = match
