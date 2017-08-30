from functools import wraps
from flask import abort
from flask_principal import Permission, UserNeed
from flask_security.decorators import (
    auth_required as flask_security_auth_required,
    roles_required,
    roles_accepted,
)
from flask_sqlalchemy import camel_to_snake_case


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


def auth_required_same_user(*args, **kwargs):
    auth_kwargs = {}
    user_id_parameter_name = 'id'
    if not _was_decorated_without_parenthesis(*args):
        auth_kwargs = kwargs
        if args and isinstance(args[0], str):
            user_id_parameter_name = args[0]

    def wrapper(fn):
        @wraps(fn)
        @auth_required(**auth_kwargs)
        def decorated(*args, **kwargs):
            try:
                user_id = kwargs[user_id_parameter_name]
            except KeyError:
                raise KeyError('Unable to find user id parameter in kwargs')
            if not Permission(UserNeed(user_id)).can():
                abort(403)
            return fn(*args, **kwargs)
        return decorated

    # was used as @auth_required_same_user
    if _was_decorated_without_parenthesis(*args):
        return wrapper(args[0])

    # was used as @auth_required_same_user(kwargs)
    return wrapper


def param_converter(**param_models):
    """
    Call with url parameter names for keyword arguments, their values
     being the model to convert to.

    Models will be looked up by the parameter names. If a parameter
    is prefixed with the snake-cased model name, it will be stripped.

    If a model isn't found, abort with a 404.

    The action's argument names must match the snake-cased model names.

    # for example:
    @bp.route('/users/<int:user_id>/posts/<int:id>')
    @param_converter(user_id=User, id=Post)
    def show_post(user, post):
        # the param converter does the database lookups:
        # user = User.query.filter_by(id=user_id).first()
        # post = Post.query.filter_by(id=id).first()
        # and calls the decorated action: show_post(user, post)

    # or to customize the argument names passed to the action:
    @bp.route('/users/<int:user_id>/posts/<int:post_id>')
    @param_converter(user_id={'user_arg_name': User},
                     post_id={'post_arg_name': Post})
    def show_post(user_arg_name, post_arg_name):
        # do stuff ...
    """
    def wrapped(fn):
        @wraps(fn)
        def decorated(**params):
            kwargs = {}
            for param_name, model_mapping in param_models.items():
                if isinstance(model_mapping, dict):
                    arg_name, model = list(model_mapping.items())[0]
                else:
                    model = model_mapping
                    arg_name = camel_to_snake_case(model.__name__)
                filter_by = param_name.replace(
                    camel_to_snake_case(model.__name__) + '_', '')
                instance = model.query.filter_by(**{
                    filter_by: params[param_name],
                }).first()
                if not instance:
                    abort(404)
                kwargs[arg_name] = instance
            return fn(**kwargs)
        return decorated
    return wrapped


def _was_decorated_without_parenthesis(*args):
    return args and callable(args[0])
