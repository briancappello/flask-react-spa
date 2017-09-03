from functools import wraps
from http import HTTPStatus
from flask import abort, request
from flask_principal import Permission, UserNeed
from flask_security.decorators import (
    auth_required as flask_security_auth_required,
    roles_accepted,
    roles_required,
)

from backend.utils import was_decorated_without_parenthesis


def auth_required(*args, **kwargs):
    required_roles = []
    one_of_roles = []
    if not was_decorated_without_parenthesis(args):
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

    if was_decorated_without_parenthesis(args):
        return wrapper(args[0])
    return wrapper


def auth_required_same_user(*args, **kwargs):
    auth_kwargs = {}
    user_id_parameter_name = 'id'
    if not was_decorated_without_parenthesis(args):
        auth_kwargs = kwargs
        if args and isinstance(args[0], str):
            user_id_parameter_name = args[0]

    def wrapper(fn):
        @wraps(fn)
        @auth_required(**auth_kwargs)
        def decorated(*args, **kwargs):
            try:
                user_id = request.view_args[user_id_parameter_name]
            except KeyError:
                raise KeyError('Unable to find user lookup parameter %s'
                               ' in kwargs' % user_id_parameter_name)
            if not Permission(UserNeed(user_id)).can():
                abort(HTTPStatus.FORBIDDEN)
            return fn(*args, **kwargs)
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapper(args[0])
    return wrapper
