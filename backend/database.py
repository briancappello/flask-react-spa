from datetime import datetime

import sqlalchemy
from sqlalchemy.orm.relationships import RelationshipProperty

from .extensions import db

# alias common names
Table = db.Table                # type: sqlalchemy.schema.Table
Column = db.Column              # type: sqlalchemy.schema.Column
String = db.String              # type: sqlalchemy.types.String
Text = db.Text                  # type: sqlalchemy.types.Text
Integer = db.Integer            # type: sqlalchemy.types.Integer
DateTime = db.DateTime          # type: sqlalchemy.types.DateTime
relationship = db.relationship  # type: RelationshipProperty


class Model(db.Model):
    """Base table class with primary key and convenience methods."""
    __abstract__ = True
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    @classmethod
    def get(cls, id):
        """Get one record by ID."""
        return cls.query.get(int(id))

    @classmethod
    def get_by(cls, **kwargs):
        """Get one record by keyword args."""
        return cls.query.filter_by(**kwargs).first()

    @classmethod
    def create(cls, commit=False, **kwargs):
        """Create a new record add it to the database session."""
        instance = cls(**kwargs)
        return instance.save(commit)

    def update(self, commit=False, **kwargs):
        """Update fields on the record."""
        for attr, value in kwargs.items():
            setattr(self, attr, value)
        return self.save(commit)

    def save(self, commit=False):
        """Save the record to the session."""
        db.session.add(self)
        if commit:
            db.session.commit()
        return self

    def delete(self, commit=False):
        """Delete the record from the session."""
        db.session.delete(self)
        return commit and db.session.commit()

    def _repr_props_(self):
        """Overload to adjust string representation. 'id' will always be included.
        :return: iterable of property/column names
        """
        return ['created_at', 'updated_at']

    def __repr__(self):
        properties = ['{!s}={!r}'.format(prop, getattr(self, prop))
                      for prop in self._repr_props_() if hasattr(self, prop)]
        return '<{} id={} {}>'.format(self.__class__.__name__, self.id, ' '.join(properties))


# RELATIONSHIP DOCS
# http://flask-sqlalchemy.pocoo.org/2.1/models/#one-to-many-relationships
# http://flask-sqlalchemy.pocoo.org/2.1/models/#many-to-many-relationships
# http://docs.sqlalchemy.org/en/rel_1_0/orm/basic_relationships.html#relationship-patterns
# http://docs.sqlalchemy.org/en/rel_1_0/orm/backref.html#relationships-backref


def foreign_key(table_name, nullable=False, **kwargs):
    """Adds a foreign key column.

    Usage: ::
        category_id = foreign_key('category')
        category = relationship('Category', back_populates='categories')
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
