from functools import wraps
from http import HTTPStatus
from flask import abort, request
from flask_login import current_user
from flask_principal import Permission, RoleNeed, UserNeed
from flask_security.decorators import auth_required as flask_security_auth_required

from backend.utils import was_decorated_without_parenthesis


def anonymous_user_required(*args, **kwargs):
    """Decorator requiring no user be logged in

    Aborts with HTTP 403: Forbidden if there is an authenticated user
    """
    def wrapper(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            if current_user.is_authenticated:
                abort(HTTPStatus.FORBIDDEN)
            return fn(*args, **kwargs)
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapper(args[0])

    return wrapper


def auth_required(*args, **kwargs):
    """Decorator for requiring an authenticated user, optionally with roles

    Roles are passed as keyword arguments, like so:
    @auth_required(role='REQUIRE_THIS_ONE_ROLE')
    @auth_required(roles=['REQUIRE', 'ALL', 'OF', 'THESE', 'ROLES'])
    @auth_required(one_of=['EITHER_THIS_ROLE', 'OR_THIS_ONE'])

    One of role or roles kwargs can also be combined with one_of:
    @auth_required(role='REQUIRED', one_of=['THIS', 'OR_THIS'])
    # equivalent, but more clearly describing the resultant behavior:
    @auth_required(role='REQUIRED', and_one_of=['THIS', 'OR_THIS'])

    Aborts with HTTP 401: Unauthorized if no user is logged in, or
    HTTP 403: Forbidden if any of the specified role checks fail
    """
    required_roles = []
    one_of_roles = []
    if not was_decorated_without_parenthesis(args):
        if 'role' in kwargs and 'roles' in kwargs:
            raise RuntimeError('can only pass one of `role` or `roles` kwargs to auth_required')
        elif 'role' in kwargs:
            required_roles = [kwargs['role']]
        elif 'roles' in kwargs:
            required_roles = kwargs['roles']

        if 'one_of' in kwargs and 'and_one_of' in kwargs:
            raise RuntimeError('can only pass one of `one_of` or `and_one_of` kwargs to auth_required')
        elif 'one_of' in kwargs:
            one_of_roles = kwargs['one_of']
        elif 'and_one_of' in kwargs:
            one_of_roles = kwargs['and_one_of']

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
    """Decorator for requiring an authenticated user to be the same as the
    user in the URL parameters. By default the user url parameter name to
    lookup is 'id', but this can be customized by passing an argument:

    @auth_require_same_user('user_id')
    @bp.route('/users/<int:user_id>/foo/<int:id>')
    def get(user_id, id):
        # do stuff

    Any keyword arguments are passed along to the @auth_required decorator,
    so roles can also be specified in the same was as it, eg:
    @auth_required_same_user('user_id', role='ROLE_ADMIN')

    Aborts with HTTP 403: Forbidden if the user-check fails
    """
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
                raise KeyError('Unable to find the user lookup parameter '
                               f'{user_id_parameter_name} in the url args')
            if not Permission(UserNeed(user_id)).can():
                abort(HTTPStatus.FORBIDDEN)
            return fn(*args, **kwargs)
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapper(args[0])
    return wrapper


def roles_required(*roles):
    """Decorator which specifies that a user must have all the specified roles.

    Aborts with HTTP 403: Forbidden if the user doesn't have the required roles

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
    specified roles.

    Aborts with HTTP: 403 if the user doesn't have at least one of the roles

    Example::

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
