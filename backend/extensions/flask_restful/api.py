from flask.views import MethodViewType
from flask_restful import Api as BaseApi
from flask_sqlalchemy import camel_to_snake_case


class Api(BaseApi):
    """
    Overridden to support registering individual view functions with the
    same api as Blueprints, eg:

    @api.route('/path', methods=['GET'])
    def foo():
        # do stuff

    It also providers better cosmetics for automatic endpoint naming.
    """
    def __init__(self, app=None, prefix='',
                 default_mediatype='application/json',
                 decorators=None, catch_all_404s=False,
                 serve_challenge_on_401=False,
                 url_part_order='bae', errors=None):
        super(Api, self).__init__(app,
                                  prefix=prefix,
                                  default_mediatype=default_mediatype,
                                  decorators=decorators,
                                  catch_all_404s=catch_all_404s,
                                  serve_challenge_on_401=serve_challenge_on_401,
                                  url_part_order=url_part_order,
                                  errors=errors)

        # registry for individual view functions
        self._got_registered_once = False
        self.deferred_functions = []

    def _init_app(self, app):
        super(Api, self)._init_app(app)
        self._got_registered_once = True

        # register individual view functions with the app
        for deferred in self.deferred_functions:
            deferred(app)

    def resource(self, model, *urls, **kwargs):
        """
        Overridden to customize the endpoint name
        """
        def decorator(cls):
            cls.model = model
            endpoint = self._get_endpoint(cls, kwargs.pop('endpoint', None))
            self.add_resource(cls, *urls, endpoint=endpoint, **kwargs)
            return cls
        return decorator

    def route(self, rule, **options):
        """
        Decorator for registering individual view functions, like blueprints, eg:

        api = Api(prefix='/api/v1')

        @api.route('/foo')
        def get_foo():
            # do stuff
        """
        def decorator(fn):
            endpoint = self._get_endpoint(fn, options.pop('endpoint', None))
            self.add_url_rule(rule, endpoint, fn, **options)
            return fn
        return decorator

    def add_url_rule(self, rule, endpoint=None, view_func=None, **options):
        if not rule.startswith('/'):
            raise ValueError('URL rule must start with a forward slash (/)')
        rule = self.prefix + rule
        self.record(lambda _app: _app.add_url_rule(rule, endpoint, view_func, **options))

    def record(self, fn):
        if self._got_registered_once:
            from warnings import warn
            warn(Warning('The api was already registered once but is getting'
                         ' modified now. These changes will not show up.'))
        self.deferred_functions.append(fn)

    def _get_endpoint(self, view_func, endpoint=None):
        if endpoint:
            assert '.' not in endpoint, 'Api endpoints should not contain dots'
        elif isinstance(view_func, MethodViewType):
            endpoint = camel_to_snake_case(view_func.__name__)
        else:
            endpoint = view_func.__name__
        return 'api.' + endpoint
