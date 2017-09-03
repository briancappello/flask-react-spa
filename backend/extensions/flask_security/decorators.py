from functools import wraps
from http import HTTPStatus
from flask import abort, request
from flask_login import current_user
from flask_principal import Permission, RoleNeed, UserNeed
from flask_security.decorators import auth_required as flask_security_auth_required

from backend.utils import was_decorated_without_parenthesis


def anonymous_user_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if current_user.is_authenticated:
            abort(HTTPStatus.FORBIDDEN)
        return fn(*args, **kwargs)
    return wrapper


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


def roles_required(*roles):
    """Decorator which specifies that a user must have all the specified roles.
    Example::

        @app.route('/dashboard')
        @roles_required('ROLE_ADMIN', 'ROLE_EDITOR')
        def dashboard():
            return 'Dashboard'

    The current user must have both the `ROLE_ADMIN` and `ROLE_EDITOR` roles
    in order to view the page.

    :param args: The required roles.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            perms = [Permission(RoleNeed(role)) for role in roles]
            for perm in perms:
                if not perm.can():
                    abort(HTTPStatus.FORBIDDEN)
            return fn(*args, **kwargs)
        return decorated_view
    return wrapper


def roles_accepted(*roles):
    """Decorator which specifies that a user must have at least one of the
    specified roles. Example::

        @app.route('/create_post')
        @roles_accepted('ROLE_ADMIN', 'ROLE_EDITOR')
        def create_post():
            return 'Create Post'

    The current user must have either the `ROLE_ADMIN` role or `ROLE_EDITOR`
    role in order to view the page.

    :param args: The possible roles.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorated_view(*args, **kwargs):
            perm = Permission(*[RoleNeed(role) for role in roles])
            if not perm.can():
                abort(HTTPStatus.FORBIDDEN)
            return fn(*args, **kwargs)
        return decorated_view
    return wrapper
