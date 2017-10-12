from functools import partial
from sqlalchemy import event

from backend.utils import slugify as _slugify, was_decorated_without_parenthesis


# EVENTS DOCS
# http://docs.sqlalchemy.org/en/rel_1_1/core/event.html
# ORM EVENTS DOCS
# http://docs.sqlalchemy.org/en/rel_1_1/orm/events.html


class _SQLAlchemyEvent(object):
    """Private helper class for the @attach_events and @on decorators"""
    ATTR = '_sqlalchemy_event'

    def __init__(self, field_name, event_name, listen_kwargs=None):
        self.field_name = field_name
        self.event_name = event_name
        self.listen_kwargs = listen_kwargs or {}


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
