from datetime import datetime

import sqlalchemy
from sqlalchemy.orm.relationships import RelationshipProperty
from sqlalchemy.ext.associationproxy import association_proxy

from .extensions import db

# alias common names
BaseModel = db.Model            # type: db.Model
Table = db.Table                # type: sqlalchemy.schema.Table
# FIXME: Column defaults nullable to True; should probably override that
Column = db.Column              # type: sqlalchemy.schema.Column
String = db.String              # type: sqlalchemy.types.String
Text = db.Text                  # type: sqlalchemy.types.Text
Integer = db.Integer            # type: sqlalchemy.types.Integer
Boolean = db.Boolean            # type: sqlalchemy.types.Boolean
DateTime = db.DateTime          # type: sqlalchemy.types.DateTime
relationship = db.relationship  # type: RelationshipProperty
backref = db.backref            # type: RelationshipProperty
ForeignKey = db.ForeignKey
UniqueConstraint = sqlalchemy.UniqueConstraint


class Model(db.Model):
    """Base table class with primary key, created_at and updated_at fields.
    Includes convenience methods for querying, saving, updating and deleting
    models.
    """
    __abstract__ = True
    __table_args__ = {'extend_existing': True}

    __repr_props__ = ('id', 'created_at', 'updated_at')
    """Set to customize automatic string representation.
    For example::

        class User(database.Model):
            __repr_props__ = ('id', 'email')

            email = Column(String)

        user = User(id=1, email='foo@bar.com')
        print(user)  # prints <User id=1 email="foo@bar.com">
    """

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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
        return '<{} id={} {}>'.format(self.__class__.__name__, self.id, ' '.join(properties))


# RELATIONSHIP DOCS
# http://flask-sqlalchemy.pocoo.org/2.1/models/#one-to-many-relationships
# http://flask-sqlalchemy.pocoo.org/2.1/models/#many-to-many-relationships
# http://docs.sqlalchemy.org/en/rel_1_0/orm/basic_relationships.html#relationship-patterns
# http://docs.sqlalchemy.org/en/rel_1_0/orm/backref.html#relationships-backref


def foreign_key(table_name, nullable=False, **kwargs):
    """Use to add a foreign key Column to a model.

    For example::

        class Post(database.Model):
            category_id = foreign_key('category')

    Is equivalent to::

        class Post(database.Model):
            category_id = Column(Integer, ForeignKey('category.id'))

    :param str table_name: the table name of the referenced model
    :param bool nullable: whether or not the foreign key can be null
    :param dict kwargs: any other kwargs to pass the Column constructor
    """
    return Column(Integer, db.ForeignKey(table_name + '.id'), nullable=nullable, **kwargs)


def join_table(model_name1, model_name2, *extra_columns):
    """Creates a join table.

    Usage: ::
        symbol_industry = join_table('Symbol', 'Industry')
        class Symbol(Model):
            industries = relationship('Industry', secondary=symbol_industry, back_populates='symbols')
        class Industry(Model)
            symbols = relationship('Symbol', secondary=symbol_industry, back_populates='industries')
    """
    table1 = model_name1.lower()
    table2 = model_name2.lower()
    return Table(
        '{}_{}'.format(table1, table2),
        Column('{}_id'.format(table1), Integer, db.ForeignKey('{}.id'.format(table1))),
        Column('{}_id'.format(table2), Integer, db.ForeignKey('{}.id'.format(table2))),
        *extra_columns
    )
