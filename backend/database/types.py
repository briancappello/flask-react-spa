import pytz
import sqlalchemy

from sqlalchemy import types
from sqlalchemy.dialects import sqlite

from backend.extensions import db


# alias common names
BigInteger = db.BigInteger().with_variant(sqlite.INTEGER(), 'sqlite')  # type: sqlalchemy.types.BigInteger
Boolean = db.Boolean            # type: sqlalchemy.types.Boolean
Date = db.Date                  # type: sqlalchemy.types.Date
Enum = db.Enum                  # type: sqlalchemy.types.Enum
Float = db.Float                # type: sqlalchemy.types.Float
ForeignKey = db.ForeignKey      # type: sqlalchemy.schema.ForeignKey
Integer = db.Integer            # type: sqlalchemy.types.Integer
Interval = db.Interval          # type: sqlalchemy.types.Interval
Numeric = db.Numeric            # type: sqlalchemy.types.Numeric
SmallInteger = db.SmallInteger  # type: sqlalchemy.types.SmallInteger
String = db.String              # type: sqlalchemy.types.String
Text = db.Text                  # type: sqlalchemy.types.Text
Time = db.Time                  # type: sqlalchemy.types.Time


class DateTime(types.TypeDecorator):
    impl = types.DateTime

    def __init__(self, *args, **kwargs):
        kwargs['timezone'] = True
        super().__init__(*args, **kwargs)

    def process_bind_param(self, value, dialect):
        if value is not None:
            if value.tzinfo is None:
                raise ValueError('Cannot persist timezone-naive datetime')
            return value.astimezone(pytz.UTC)

    def process_result_value(self, value, dialect):
        if value is not None:
            return value.astimezone(pytz.UTC)
