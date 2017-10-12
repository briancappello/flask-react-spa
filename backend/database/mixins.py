from sqlalchemy import func

from .column import Column
from .types import BigInteger, DateTime


class PrimaryKeyMixin(object):
    id = Column(BigInteger, primary_key=True)


class TimestampMixin(object):
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
