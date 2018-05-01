from datetime import datetime, timezone

# alias dateutil.parser.parse here to a sensible name
from dateutil.parser import parse as parse_datetime


def timestamp_to_datetime(seconds, tz=None):
    """Returns a datetime.datetime of `seconds` in UTC

    :param seconds: timestamp relative to the epoch
    :param tz: timezone of the timestamp
    """
    if tz is None:
        tz = timezone.utc
    dt = datetime.fromtimestamp(seconds, tz)
    return dt.astimezone(timezone.utc)


def utcnow():
    return datetime.now(timezone.utc)
