import enum

from flask import Blueprint, current_app, make_response
from flask.json import dumps, JSONEncoder as BaseJSONEncoder
from flask.views import MethodViewType
from flask_restful import Api as BaseApi
from flask_sqlalchemy.model import camel_to_snake_case, Model
from marshmallow import MarshalResult
from werkzeug.wrappers import Response

from backend.extensions import db
from backend.utils import was_decorated_without_parenthesis

from .constants import CREATE, DELETE, GET, LIST, PATCH, PUT
from .model_resource import ModelResource
from .utils import get_last_param_name


def _get_model_resource_args(args):
    bp, model, urls = None, args[0], args[1:]
    if isinstance(args[0], Blueprint):
        bp, model, urls = args[0], args[1], args[2:]
    if not issubclass(model, db.Model):
        raise NotImplementedError(
            f"The {'second' if bp else 'first'} argument to Api.model_resource"
            ' must be a database model class')
    if not urls:
        raise NotImplementedError(
            'Api.model_resource requires at least one url argument.')
    return bp, model, urls


class Api(BaseApi):
    """Extends :class:`flask_restful.Api` to support integration with
    Flask-Marshmallow serializers, along with a few other minor enhancements:

    - can register individual view functions ala blueprints, via @api.route()
    - supports using flask.jsonify() in resource methods
    """
    def __init__(self, name, app=None, prefix='',
                 default_mediatype='application/json',
                 decorators=None, catch_all_404s=False,
                 serve_challenge_on_401=False,
                 url_part_order='bae', errors=None):
        super().__init__(app,
                         prefix=prefix,
                         default_mediatype=default_mediatype,
                         decorators=decorators,
                         catch_all_404s=catch_all_404s,
                         serve_challenge_on_401=serve_challenge_on_401,
                         url_part_order=url_part_order,
                         errors=errors)
        # name prefix for endpoints
        self.name = name

        # configure a customized output_json function so that we can use
        # Flask's current_app.json_encoder setting
        self.representations = {
            'application/json': output_json,
        }

        # registry for individual view functions
        self._got_registered_once = False
        self.deferred_functions = []

        # automatic serializer handling
        self.deferred_serializers = []
        self.serializers = {}
        self.serializers_many = {}

    def _init_app(self, app):
        super()._init_app(app)
        self._got_registered_once = True

        # register individual view functions with the app
        for deferred in self.deferred_functions:
            deferred(app)

        # instantiate serializers
        for serializer_class in app.serializers.values():
            model_name = serializer_class.Meta.model.__name__
            self.serializers[model_name] = serializer_class()
            self.serializers_many[model_name] = serializer_class(many=True)

        # register serializer overrides
        for model_name, serializer_class, many in self.deferred_serializers:
            if many:
                self.serializers_many[model_name] = serializer_class(many=True)
            else:
                self.serializers[model_name] = serializer_class()

        # attach serializers to Resource instances so that they can perform
        # automatic deserialization from json requests
        for resource, _, _ in self.resources:
            model_name = resource.model.__name__
            if model_name not in self.serializers:
                raise KeyError(
                    f'Could not find a serializer for the {model_name} model!')
            resource.serializer = self.serializers[model_name]
            resource.serializer_create = self.serializers[model_name].__class__()
            resource.serializer_create.context['is_create'] = True

        self._register_json_encoder(app, self.serializers)

    def resource(self, *urls, **kwargs):
        """Decorator to wrap a :class:`~flask_restful.Resource` class, adding
        it to the api. Parameters are the same as
        :meth:`~flask_restful.Api.add_resource`.

        Example::

            app = Flask(__name__)
            api = Api('api', app)

            @api.resource('/foo')
            class FooResource(Resource):
                def get(self):
                    return 'Hello, World!'

        Overridden to customize the endpoint name
        """
        if urls and isinstance(urls[0], Blueprint):
            bp = urls[0]
            urls = (f"{bp.url_prefix or ''}{url}" for url in urls[1:])

        def decorator(cls):
            endpoint = self._get_endpoint(cls, kwargs.pop('endpoint', None))
            self.add_resource(cls, *urls, endpoint=endpoint, **kwargs)
            return cls
        return decorator

    def model_resource(self, *args, **kwargs):
        """Decorator to wrap a :class:`backend.api.ModelResource` class, adding
        it to the api. There are two supported method signatures:

        `Api.model_resource(model, *urls, **kwargs)`

        and

        `Api.model_resource(blueprint, model, *urls, *kwargs)`

        Example without blueprint::

            from backend.extensions.api import api
            from models import User

            @api.model_resource(User, '/users', '/users/<int:id>')
            class UserResource(Resource):
                def get(self, user):
                    return user

                def list(self, users):
                    return users

        Example with blueprint::

            from backend.extensions.api import api
            from models import User
            from views import bp

            @api.model_resource(bp, User, '/users', '/users/<int:id>')
            class UserResource(Resource):
                def get(self, user):
                    return user

                def list(self, users):
                    return users
        """
        bp, model, urls = _get_model_resource_args(args)
        if bp:
            urls = (f"{bp.url_prefix or ''}{url}" for url in urls)

        def decorator(cls):
            cls.model = model
            endpoint = self._get_endpoint(cls, kwargs.pop('endpoint', None))
            self.add_resource(cls, *urls, endpoint=endpoint, **kwargs)
            return cls
        return decorator

    def serializer(self, *args, many=False):
        """Decorator to wrap a :class:`~backend.api.ModelSerializer` class,
        registering the wrapped serializer as the specific one to use for the
        serializer's model.

         For example::

            from backend.extensions.api import api
            from backend.api import ModelSerializer
            from models import Foo

            @api.serializer  # @api.serializer() works too
            class FooSerializer(ModelSerializer):
                class Meta:
                    model = Foo

            @api.serializer(many=True)
            class FooListSerializer(ModelSerializer):
                class Meta:
                    model = Foo
         """
        def decorator(serializer_class):
            model_name = serializer_class.Meta.model.__name__
            self.deferred_serializers.append((model_name, serializer_class, many))
            return serializer_class
        if was_decorated_without_parenthesis(args):
            return decorator(args[0])
        return decorator

    def route(self, *args, **kwargs):
        """Decorator for registering individual view functions.

        Usage without blueprint::

            api = Api('api', prefix='/api/v1')

            @api.route('/foo')  # resulting url: /api/v1/foo
            def get_foo():
                # do stuff

        Usage with blueprint::

            api = Api('api', prefix='/api/v1')
            team = Blueprint('team', url_prefix='/team')

            @api.route(team, '/users')  # resulting url: /api/v1/team/users
            def users():
                # do stuff
        """
        bp, url = None, args[0]
        if isinstance(args[0], Blueprint):
            bp, url = args[0], args[1]
            url = f"{bp.url_prefix or ''}{url}"

        def decorator(fn):
            endpoint = self._get_endpoint(fn, kwargs.pop('endpoint', None))
            self.add_url_rule(url, endpoint, fn, **kwargs)
            return fn
        return decorator

    def add_url_rule(self, rule, endpoint=None, view_func=None, **kwargs):
        if not rule.startswith('/'):
            raise ValueError('URL rule must start with a forward slash (/)')
        rule = self.prefix + rule
        self.record(
            lambda _app: _app.add_url_rule(rule, endpoint, view_func, **kwargs)
        )

    def record(self, fn):
        if self._got_registered_once:
            from warnings import warn
            warn(Warning('The api was already registered once but is getting'
                         ' modified now. These changes will not show up.'))
        self.deferred_functions.append(fn)

    def _get_endpoint(self, view_func, endpoint=None, plural=False):
        if endpoint:
            assert '.' not in endpoint, 'Api endpoints should not contain dots'
        elif isinstance(view_func, MethodViewType):
            endpoint = camel_to_snake_case(view_func.__name__)
            if hasattr(view_func, 'model') and plural:
                plural_model = camel_to_snake_case(view_func.model.__plural__)
                endpoint = f'{plural_model}_resource'
        else:
            endpoint = view_func.__name__
        return f'{self.name}.{endpoint}'

    def _register_json_encoder(self, app, serializers):
        BaseEncoderClass = app.json_encoder or BaseJSONEncoder

        class JSONEncoder(BaseEncoderClass):
            def default(self, o):
                if isinstance(o, enum.Enum):
                    return o.name

                if isinstance(o, Model):
                    model_name = o.__class__.__name__
                    if model_name in serializers:
                        return serializers[model_name].dump(o).data
                return super().default(o)

        app.json_encoder = JSONEncoder

    def make_response(self, data, *args, **kwargs):
        """Overridden to support returning already-formed Responses unmodified,
        as well as automatic serialization of lists of sqlalchemy models
        (serialization of individual models is handled by a custom JSONEncoder
         class configured in the self._register_json_encoder method)
        """
        # we've already got a response, eg, from jsonify
        if isinstance(data, Response):
            return (data, *args)

        if isinstance(data, (list, tuple)) and len(data) and isinstance(data[0], Model):
            model_name = data[0].__class__.__name__
            if model_name in self.serializers_many:
                data = self.serializers_many[model_name].dump(data).data

        # we got the result of serializer.dump(obj)
        if isinstance(data, MarshalResult):
            data = data.data

        # we got plain python data types that need to be serialized
        return super().make_response(data, *args, **kwargs)

    def _register_view(self, app, resource, *urls, **kwargs):
        """Overridden to handle custom method names on ModelResources
        """
        if not issubclass(resource, ModelResource) or 'methods' in kwargs:
            return super()._register_view(app, resource, *urls, **kwargs)

        for url in urls:
            endpoint = self._get_endpoint(resource)
            http_methods = []
            has_last_param = get_last_param_name(url)
            if has_last_param:
                if ModelResource.has_method(resource, GET):
                    http_methods += ['GET', 'HEAD']
                if ModelResource.has_method(resource, DELETE):
                    http_methods += ['DELETE']
                if ModelResource.has_method(resource, PATCH):
                    http_methods += ['PATCH']
                if ModelResource.has_method(resource, PUT):
                    http_methods += ['PUT']
            else:
                endpoint = self._get_endpoint(resource, plural=True)
                if ModelResource.has_method(resource, LIST):
                    http_methods += ['GET', 'HEAD']
                if ModelResource.has_method(resource, CREATE):
                    http_methods += ['POST']

            kwargs['endpoint'] = endpoint
            super()._register_view(app, resource, url, **kwargs,
                                   methods=http_methods)


def output_json(data, code, headers=None):
    """Replaces Flask-RESTful's default output_json function, using
    Flask.json's dumps method instead of the stock Python json.dumps.

    Mainly this means we end up using the current app's configured
    json_encoder class.
    """
    settings = current_app.config.get('RESTFUL_JSON', {})

    # If we're in debug mode, and the indent is not set, we set it to a
    # reasonable value here.
    if current_app.debug:
        settings.setdefault('indent', 4)

    # always end the json dumps with a new line
    # see https://github.com/mitsuhiko/flask/pull/1262
    dumped = dumps(data, **settings) + '\n'

    response = make_response(dumped, code)
    response.headers.extend(headers or {})
    return response
