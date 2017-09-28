import sqlalchemy

from datetime import datetime
from flask_sqlalchemy import camel_to_snake_case
from sqlalchemy import event

from .extensions import db
from .utils import slugify as _slugify


# a bit of hackery to make type-hinting in PyCharm work correctly
from sqlalchemy.orm.relationships import RelationshipProperty
class __relationship_type_hinter__(RelationshipProperty):
    # implement __call__ to silence the silly "not callable" warning
    def __call__(self, *args, **kwargs):
        pass


# alias common names
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_method, hybrid_property
String = db.String              # type: sqlalchemy.types.String
Text = db.Text                  # type: sqlalchemy.types.Text
Integer = db.Integer            # type: sqlalchemy.types.Integer
Boolean = db.Boolean            # type: sqlalchemy.types.Boolean
DateTime = db.DateTime          # type: sqlalchemy.types.DateTime
relationship = db.relationship  # type: __relationship_type_hinter__
backref = db.backref            # type: __relationship_type_hinter__
ForeignKey = db.ForeignKey      # type: sqlalchemy.schema.ForeignKey
UniqueConstraint = sqlalchemy.UniqueConstraint


def listen(event_name, fn):
    def wrapper(cls):
        event.listen(cls, event_name, fn)
        return cls
    return wrapper


def listen_on(event_name, field_name, fn):
    def wrapper(cls):
        event.listen(getattr(cls, field_name), event_name, fn)
        return cls
    return wrapper


def _set_slug(target, value, old_value, _):
    if value and (not target.slug or value != old_value):
        target.slug = _slugify(value)


def slugify(field):
    def wrapper(cls):
        event.listen(getattr(cls, field), 'set', _set_slug)
        return cls
    return wrapper


class Column(db.Column):
    # overridden to make nullable False by default
    def __init__(self, *args, nullable=False, **kwargs):
        super(Column, self).__init__(*args, nullable=nullable, **kwargs)


class BaseModel(db.Model):
    """Base table class. It includes convenience methods for creating,
    querying, saving, updating and deleting models.
    """
    __abstract__ = True
    __table_args__ = {'extend_existing': True}

    __repr_props__ = ()
    """Set to customize automatic string representation.

    For example::

        class User(database.Model):
            __repr_props__ = ('id', 'email')

            email = Column(String)

        user = User(id=1, email='foo@bar.com')
        print(user)  # prints <User id=1 email="foo@bar.com">
    """

    @classmethod
    def all(cls):
        """Get all models."""
        return cls.query.all()

    @classmethod
    def get(cls, id):
        """Get one model by ID.

        :param id: The model ID to get.
        """
        return cls.query.get(int(id))

    @classmethod
    def get_by(cls, **kwargs):
        """Get one model by keyword arguments.

        :param kwargs: The model attribute values to filter by.
        """
        return cls.query.filter_by(**kwargs).first()

    @classmethod
    def get_or_create(cls, commit=True, **kwargs):
        """Get or create model by keyword arguments.

        :param bool commit: Whether or not to immediately commit the DB session (if create).
        :param kwargs: The model attributes to get or create by.
        """
        instance = cls.get_by(**kwargs)
        if not instance:
            instance = cls.create(**kwargs, commit=commit)
        return instance

    @classmethod
    def filter_by(cls, **kwargs):
        """Find models by keyword arguments.

        :param kwargs: The model attribute values to filter by.
        """
        return cls.query.filter_by(**kwargs)

    @classmethod
    def create(cls, commit=True, **kwargs):
        """Create a new model and add it to the database session.

        :param bool commit: Whether or not to immediately commit the DB session.
        :param kwargs: The model attribute values to create the model with.
        """
        instance = cls(**kwargs)
        return instance.save(commit)

    def update(self, commit=False, **kwargs):
        """Update fields on the model.

        :param bool commit: Whether or not to immediately commit the DB session.
        :param kwargs: The model attribute values to update the model with.
        """
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return self.save(commit)

    def save(self, commit=False):
        """Save the model.

        :param bool commit: Whether or not to immediately commit the DB session.
        """
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit=False):
        """Delete the model.

        :param bool commit: Whether or not to immediately commit the DB session.
        """
        db.session.delete(self)
        return commit and db.session.commit()

    def __repr__(self):
        properties = ['{!s}={!r}'.format(prop, getattr(self, prop))
                      for prop in self.__repr_props__ if hasattr(self, prop)]
        return '<{} {}>'.format(self.__class__.__name__, ' '.join(properties))


class Model(BaseModel):
    """Base table class that extends :class:`backend.database.BaseModel` and
    includes a primary key :attr:`id` field along with automatically
    date-stamped :attr:`created_at` and :attr:`updated_at` fields.
    """
    __abstract__ = True
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __repr_props__ = ('id', 'created_at', 'updated_at')


# RELATIONSHIP DOCS
# http://docs.sqlalchemy.org/en/rel_1_1/orm/basic_relationships.html#relationship-patterns
# http://docs.sqlalchemy.org/en/rel_1_1/orm/backref.html#relationships-backref
# http://flask-sqlalchemy.pocoo.org/2.2/models/#one-to-many-relationships
# http://flask-sqlalchemy.pocoo.org/2.2/models/#many-to-many-relationships


def foreign_key(model_or_table_name, **kwargs):
    """Use to add a foreign key Column to a model.

    For example::

        class Post(Model):
            category_id = foreign_key('Category')
            category = relationship('Category', back_populates='posts')

    Is equivalent to::

        class Post(Model):
            category_id = Column(Integer, ForeignKey('category.id'), nullable=False)
            category = relationship('Category', back_populates='posts')

    :param model_or_table_name: the model or table name to link to

        If given a lowercase string, it's treated as an explicit table name.

        If there are any uppercase characters, it's assumed to be a model name,
        and will be converted to snake case using the same automatic conversion
        as Flask-SQLAlchemy does itself.

        If given an instance of :class:`flask_sqlalchemy.Model`, use its
        :attr:`__tablename__` attribute.

    :param dict kwargs: any other kwargs to pass the Column constructor
    """
    table_name = model_or_table_name
    if isinstance(model_or_table_name, db.Model):
        table_name = model_or_table_name.__tablename__
    elif table_name != model_or_table_name.lower():
        table_name = camel_to_snake_case(model_or_table_name)
    return Column(Integer, db.ForeignKey('{}.id'.format(table_name)), **kwargs)
