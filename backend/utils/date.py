import datetime
import pytz

# export a common alias for dateutil.parser.parse
from dateutil.parser import parse as parse_datetime


def timestamp_to_datetime(seconds, tz=None):
    """Returns a datetime.datetime of seconds in UTC

    :param seconds: timestamp relative to the epoch
    :param tz: timezone of the timestamp
    """
    if tz is None:
        tz = pytz.UTC
    dt = datetime.datetime.fromtimestamp(seconds, tz)
    return dt.astimezone(pytz.UTC)


def utcnow():
    """Returns a current timezone-aware datetime.datetime in UTC
    """
    return datetime.datetime.now(datetime.timezone.utc)
