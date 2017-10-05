import sqlalchemy

from datetime import datetime
from flask_sqlalchemy.model import camel_to_snake_case
from functools import partial
from sqlalchemy import event

from .extensions import db
from .utils import slugify as _slugify, was_decorated_without_parenthesis


# a bit of hackery to make type-hinting in PyCharm work correctly
from sqlalchemy.orm.relationships import RelationshipProperty
class __relationship_type_hinter__(RelationshipProperty):
    # implement __call__ to silence the silly "not callable" warning
    def __call__(self, *args, **kwargs):
        pass


# alias common names
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.declarative import declared_attr
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


class _SQLAlchemyEvent(object):
    ATTR = '_sqlalchemy_event'

    def __init__(self, field_name, event_name, listen_kwargs=None):
        self.field_name = field_name
        self.event_name = event_name
        self.listen_kwargs = listen_kwargs or {}


# EVENTS DOCS
# http://docs.sqlalchemy.org/en/rel_1_1/core/event.html
# ORM EVENTS DOCS
# http://docs.sqlalchemy.org/en/rel_1_1/orm/events.html


def attach_events(*args):
    """Class decorator for SQLAlchemy models to attach listeners on class
    methods decorated with :func:`.on`

    Usage::

        @attach_events
        class User(Model):
            email = Column(String(50))

            @on('email', 'set')
            def lowercase_email(self, new_value, old_value, initiating_event):
                self.email = new_value.lower()
    """
    def wrapper(cls):
        for name, fn in cls.__dict__.items():
            if not name.startswith('__') and hasattr(fn, _SQLAlchemyEvent.ATTR):
                e = getattr(fn, _SQLAlchemyEvent.ATTR)
                if e.field_name:
                    event.listen(getattr(cls, e.field_name), e.event_name, fn,
                                 **e.listen_kwargs)
                else:
                    event.listen(cls, e.event_name, fn, **e.listen_kwargs)
        return cls
    if was_decorated_without_parenthesis(args):
        return wrapper(args[0])
    return wrapper


def on(*args, **listen_kwargs):
    """Class method decorator for SQLAlchemy models. Must be used in
    conjunction with the :func:`.attach_events` class decorator

    Usage::

        @attach_events
        class Post(Model):
            uuid = Column(String(36))
            post_tags = relationship('PostTag', back_populates='post')  # m2m

            # instance event (only one positional argument, the event name)
            # kwargs are passed on to the sqlalchemy.event.listen function
            @on('init', once=True)
            def generate_uuid(self, args, kwargs):
                self.uuid = str(uuid.uuid4())

            # attribute event (two positional args, field name and event name)
            @on('post_tags', 'append')
            def set_tag_order(self, post_tag, initiating_event):
                if not post_tag.order:
                    post_tag.order = len(self.post_tags) + 1
    """
    if len(args) == 1:
        field_name, event_name = (None, args[0])
    elif len(args) == 2:
        field_name, event_name = args
    else:
        raise NotImplementedError('@on accepts only one or two positional arguments')

    def wrapper(fn):
        setattr(fn, _SQLAlchemyEvent.ATTR,
                _SQLAlchemyEvent(field_name, event_name, listen_kwargs))
        return fn
    return wrapper


def slugify(field_name, slug_field_name=None, mutable=False):
    """Class decorator to specify a field to slugify. Slugs are immutable by
    default unless mutable=True is passed.

    Usage::

        @slugify('title')
        def Post(Model):
            title = Column(String(100))
            slug = Column(String(100))

        # pass a second argument to specify the slug attribute field:
        @slugify('title', 'title_slug')
        def Post(Model)
            title = Column(String(100))
            title_slug = Column(String(100))

        # optionally set mutable to True for a slug that changes every time
        # the slugified field changes:
        @slugify('title', mutable=True)
        def Post(Model):
            title = Column(String(100))
            slug = Column(String(100))
    """
    slug_field_name = slug_field_name or 'slug'

    def _set_slug(target, value, old_value, _, mutable=False):
        existing_slug = getattr(target, slug_field_name)
        if existing_slug and not mutable:
            return
        if value and (not existing_slug or value != old_value):
            setattr(target, slug_field_name, _slugify(value))

    def wrapper(cls):
        event.listen(getattr(cls, field_name), 'set',
                     partial(_set_slug, mutable=mutable))
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
    def get_or_create(cls, commit=False, **kwargs):
        """Get or create model by keyword arguments.

        :param bool commit: Whether or not to immediately commit the DB session (if create).
        :param kwargs: The model attributes to get or create by.
        """
        instance = cls.get_by(**kwargs)
        if not instance:
            instance = cls.create(**kwargs, commit=commit)
        return instance

    @classmethod
    def join(cls, *props, **kwargs):
        return cls.query.join(*props, **kwargs)

    @classmethod
    def filter(cls, *args, **kwargs):
        return cls.query.filter(*args, **kwargs)

    @classmethod
    def filter_by(cls, **kwargs):
        """Find models by keyword arguments.

        :param kwargs: The model attribute values to filter by.
        """
        return cls.query.filter_by(**kwargs)

    @classmethod
    def create(cls, commit=False, **kwargs):
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
