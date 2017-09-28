import re
import unicodedata

from .decorators import was_decorated_without_parenthesis
from .mail import send_mail


def slugify(string):
    string = re.sub(r'[^\w\s-]', '',
                    unicodedata.normalize('NFKD', string.strip()))
    return re.sub(r'[-\s]+', '-', string).lower()
