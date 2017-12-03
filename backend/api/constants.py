import re

CREATE = 'create'
DELETE = 'delete'
GET = 'get'
HEAD = 'head'
LIST = 'list'
PATCH = 'patch'
PUT = 'put'

ALL_METHODS = (CREATE, DELETE, GET, LIST, PATCH, PUT)

__param_name_re = r'<(\w+:)?(?P<param_name>\w+)>'
PARAM_NAME_RE = re.compile(__param_name_re)
LAST_PARAM_NAME_RE = re.compile(__param_name_re + r'$')

READ_ONLY_FIELDS = ('slug', 'createdAt', 'updatedAt')
