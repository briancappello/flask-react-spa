from .base_model import BaseModel
from .mixins import PrimaryKeyMixin, TimestampMixin


class Model(PrimaryKeyMixin, TimestampMixin, BaseModel):
    """Base table class that extends :class:`backend.database.BaseModel` and
    includes a primary key :attr:`id` field along with automatically
    date-stamped :attr:`created_at` and :attr:`updated_at` fields.
    """
    __abstract__ = True
    __table_args__ = {'extend_existing': True}

    __repr_props__ = ('id', 'created_at', 'updated_at')
