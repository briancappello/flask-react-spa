import re

from .constants import LAST_PARAM_NAME_RE


def get_last_param_name(url_rule):
    match = re.search(LAST_PARAM_NAME_RE, url_rule)
    return match.group('param_name') if match else None


def to_camel_case(string):
    parts = string.split('_')
    return parts[0] + ''.join(x.title() for x in parts[1:])
