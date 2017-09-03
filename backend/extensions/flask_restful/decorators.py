from functools import wraps
from http import HTTPStatus

from flask import abort, request
from flask_sqlalchemy import camel_to_snake_case

from backend.utils import was_decorated_without_parenthesis


def param_converter(*args, **param_models):
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
        def decorated(*args, **params):
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
                    abort(HTTPStatus.NOT_FOUND)
                kwargs[arg_name] = instance
            return fn(*args, **kwargs)
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapped(args[0])
    return wrapped


def list_loader(*args, model):
    def wrapped(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            return fn(model.query.all())
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapped(args[0])
    return wrapped


def patch_loader(*args, serializer):
    def wrapped(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            result = serializer.load(request.get_json(), partial=True)
            if not result.errors and not result.data.id:
                abort(HTTPStatus.NOT_FOUND)
            return fn(*result)
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapped(args[0])
    return wrapped


def put_loader(*args, serializer):
    def wrapped(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            result = serializer.load(request.get_json())
            if not result.errors and not result.data.id:
                abort(HTTPStatus.NOT_FOUND)
            return fn(*result)
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapped(args[0])
    return wrapped


def post_loader(*args, serializer):
    def wrapped(fn):
        @wraps(fn)
        def decorated(*args, **kwargs):
            return fn(*serializer.load(request.get_json()))
        return decorated

    if was_decorated_without_parenthesis(args):
        return wrapped(args[0])
    return wrapped
