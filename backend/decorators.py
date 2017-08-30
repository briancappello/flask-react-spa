from functools import wraps
from flask_security.decorators import (
    auth_required as flask_security_auth_required,
    roles_required,
    roles_accepted,
)


def auth_required(*args, **kwargs):
    required_roles = []
    one_of_roles = []
    if not _was_decorated_without_parenthesis(*args):
        if 'role' in kwargs:
            required_roles = [kwargs['role']]
        elif 'roles' in kwargs:
            required_roles = kwargs['roles']
        if 'one_of' in kwargs:
            one_of_roles = kwargs['one_of']

    def wrapper(fn):
        @wraps(fn)
        @flask_security_auth_required('session', 'token')
        @roles_required(*required_roles)
        @roles_accepted(*one_of_roles)
        def decorated(*args, **kwargs):
            return fn(*args, **kwargs)
        return decorated

    # was used as @auth_required
    if _was_decorated_without_parenthesis(*args):
        return wrapper(args[0])

    # was used as @auth_required(kwargs)
    return wrapper


def _was_decorated_without_parenthesis(*args):
    return args and callable(args[0])
