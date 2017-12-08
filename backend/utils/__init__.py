import re
import unicodedata

from flask_sqlalchemy.model import camel_to_snake_case

from .decorators import was_decorated_without_parenthesis
from .mail import send_mail


def slugify(string):
    string = re.sub(r'[^\w\s-]', '',
                    unicodedata.normalize('NFKD', string.strip()))
    return re.sub(r'[-\s]+', '-', string).lower()


def title_case(string):
    return camel_to_snake_case(string).replace('_', ' ').title()


def pluralize(name):
    if name.endswith('y'):
        # right replace 'y' with 'ies'
        return 'ies'.join(name.rsplit('y', 1))
    elif name.endswith('s'):
        return f'{name}es'
    return f'{name}s'
