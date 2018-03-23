from collections import Mapping
from http import HTTPStatus
from functools import partial

from flask import request
from flask_restful import Resource
from flask_restful.utils import unpack, OrderedDict
from werkzeug.wrappers import Response

from .constants import ALL_METHODS, CREATE, DELETE, GET, HEAD, LIST, PATCH, PUT
from .decorators import (
    list_loader,
    param_converter,
    patch_loader,
    post_loader,
    put_loader,
)
from .utils import get_last_param_name


class ModelResource(Resource):
    """
    Base class for database model resource views. Includes a bit of
    configurable magic to automatically support the basic CRUD endpoints.

    For example::

        from backend.api import ModelResource
        from backend.extensions.api import api       # url_prefix='/api/v1'
        from backend.security.models import User
        from backend.security.views import security  # url_prefix='/auth'

        @api.model_resource(security, User, '/users', '/users/<int:id>')
        class UserResource(ModelResource):
            pass

    This results in the following URL endpoints::

        GET    /api/v1/auth/users       # list all Users
        POST   /api/v1/auth/users       # create new User
        GET    /api/v1/auth/users/<id>  # get User.id == <id>
        PUT    /api/v1/auth/users/<id>  # update User.id == <id>
        PATCH  /api/v1/auth/users/<id>  # partial update User.id == <id>
        DELETE /api/v1/auth/users/<id>  # delete User.id == <id>

    To limit which endpoints are included, override the `include_methods` or
    `exclude_methods` class attributes::

        from backend.api import CREATE, DELETE, GET, LIST, PATCH, PUT

        # only support list & create
        @api.model_resource(security, User, '/users')
        class UserResource(ModelResource):
            include_methods = (CREATE, LIST)

        # only support get & update
        @api.model_resource(security, User, '/users/<int:id>')
        class UserResource(ModelResource):
            include_methods = (GET, PATCH, PUT)

        # all except delete
        @api.model_resource(security, User, '/users', '/users/<int:id>')
        class UserResource(ModelResource):
            exclude_methods = (DELETE,)

    To customize the implementation of any of the methods, implement the
    lower-cased method name (shown below are the default implementations)::

        @api.model_resource(security, User, '/users', '/users/<int:id>')
        class UserResource(ModelResource):
            def list(self, users):
                return users

            def create(self, user, errors):
                if errors:
                    return self.errors(errors)
                return self.created(user)

            def get(self, user):
                return user

            def put(self, user, errors):
                if errors:
                    return self.errors(errors)
                return self.updated(user)

            def patch(self, user, errors):
                if errors:
                    return self.errors(errors)
                return self.updated(user)

            def delete(self, user):
                return self.deleted(user)

    As you can see from above, there's still a bit more magic happening behind
    the scenes to convert the request parameters/data into models. This happens
    via method decorators (and if applicable, the respective serializer for the
    model assigned to this resource). The default decorators effectively look
    like this::

        from backend.api import (
            ALL_METHODS,
            param_converter,
            list_loader,
            patch_loader,
            post_loader,
            put_loader,
        )

        @api.model_resource(security, User, '/users', '/users/<int:id>')
        class UserResource(ModelResource):
            exclude_decorators = ALL_METHODS  # disable the default decorators
            include_decorators = ()  # alternative way to disable them

            @list_loader(User)
            def list(self, users):
                return users

            @post_loader(UserResource.serializer_create)  # <- invalid syntax
            def create(self, user, errors):
                if errors:
                    return self.errors(errors)
                return self.created(user)

            @param_converter(id=User)
            def get(self, user):
                return user

            @put_loader(UserResource.serializer)  # <- invalid syntax
            def put(self, user, errors):
                if errors:
                    return self.errors(errors)
                return self.updated(user)

            @patch_loader(UserResource.serializer)  # <- invalid syntax
            def patch(self, user, errors):
                if errors:
                    return self.errors(errors)
                return self.updated(user)

            @param_converter(id=User)
            def delete(self, user):
                return self.deleted(user)

    Furthermore, you can add extra decorators to methods using
    `method_decorators`::

        from backend.security import auth_required_same_user

        @api.model_resource(security, User, '/users/<int:id>')
        class UserResource(ModelResource):
            include_methods = (PATCH, PUT)
            method_decorators = (auth_required_same_user,)

    Or on a per-method basis::

        from backend.security import (
            anonymous_user_required,
            auth_required_same_user,
        )

        @api.model_resource(security, User, '/users/<int:id>')
        class UserResource(ModelResource):
            include_methods = (CREATE, PATCH, PUT)
            method_decorators = {CREATE: [anonymous_user_required],
                                 PATCH: [auth_required_same_user],
                                 PUT: [auth_required_same_user]}
    """

    model = None
    """
    The database model class for a :class:`ModelResource`
    (automatically set by the :class:`backend.api.Api` extension instance)
    """

    serializer = None
    """
    The serializer to be used for serializing single instances of `self.model`
    (automatically set by the :class:`backend.api.Api` extension instance)
    """

    serializer_create = None
    """
    The serializer to be used when creating an instance of `self.model`
    (automatically set by the :class:`backend.api.Api` extension instance)
    """

    # control which methods to automatically support
    include_methods = ALL_METHODS
    """
    Override to limit methods supported by :class:`ModelResource`
    """

    exclude_methods = ()
    """
    Override to exclude methods supported by :class:`ModelResource`
    """

    # control application of automatic model loading/deserialization decorators
    # decorators specified in method_decorators will always be applied
    include_decorators = ALL_METHODS
    """
    Override to limit automatic decorators applied by :class:`ModelResource`
    """

    exclude_decorators = ()
    """
    Override to exclude automatic decorators applied by :class:`ModelResource`
    """

    @staticmethod
    def has_method(cls, method_name):
        auto_method = method_name in cls.include_methods and method_name not in cls.exclude_methods
        return auto_method or getattr(cls, method_name, None)

    def created(self, obj, save=True):
        """
        Convenience method for saving a model (automatically commits it to
        the database and returns the object with an HTTP 201 status code)
        """
        if save:
            obj.save(commit=True)
        return obj, HTTPStatus.CREATED

    def deleted(self, obj):
        """
        Convenience method for deleting a model (automatically commits the
        delete to the database and returns with an HTTP 204 status code)
        """
        obj.delete(commit=True)
        return '', HTTPStatus.NO_CONTENT

    def errors(self, errors):
        """
        Convenience method for returning a dictionary of errors with an
        HTTP 400 status code
        """
        return {'errors': errors}, HTTPStatus.BAD_REQUEST

    def updated(self, obj):
        """
        Convenience method for updating a model (automatically commits it to
        the database and returns the object with with an HTTP 200 status code)
        """
        obj.save(commit=True)
        return obj

    def _create(self, obj, errors):
        """Default implementation for create view"""
        if errors:
            return self.errors(errors)
        return self.created(obj)

    def _get(self, *args, **kwargs):
        """Default implementation for get and list views"""
        return args[0] if args else list(kwargs.values())[0]

    def _update(self, obj, errors):
        """Default implementation for patch and put views"""
        if errors:
            return self.errors(errors)
        return self.updated(obj)

    def _delete(self, *args, **kwargs):
        """Default implementation for delete view"""
        return self.deleted(args[0] if args else list(kwargs.values())[0])

    def dispatch_request(self, *args, **kwargs):
        """Overridden to support list and create method names, and improved
        decorator handling for methods
        """
        method = self._get_method_for_request()

        resp = method(*args, **kwargs)
        if isinstance(resp, Response):
            return resp

        representations = self.representations or OrderedDict()
        mediatype = request.accept_mimetypes.best_match(representations, default=None)
        if mediatype in representations:
            data, code, headers = unpack(resp)
            resp = representations[mediatype](data, code, headers)
            resp.headers['Content-Type'] = mediatype
            return resp

        return resp

    def _get_method_for_request(self):
        method_name = request.method.lower()
        if method_name == HEAD:
            method_name = GET

        param_name = get_last_param_name(request.url_rule.rule)
        if not param_name:
            if method_name == GET:
                method_name = LIST
            else:
                method_name = CREATE

        method = getattr(self, method_name, None)
        if method is None:
            if not ModelResource.has_method(self, method_name):
                raise AttributeError(
                    f'Unimplemented HTTP method {request.method} (expected'
                    f' ModelResource method {method_name} to be defined)')

            if method_name == CREATE:
                method = self._create
            elif method_name == DELETE:
                method = self._delete
            elif method_name in [GET, LIST]:
                method = self._get
            elif method_name in [PATCH, PUT]:
                method = self._update

        for decorator in self._get_decorators_for_method(method_name, param_name):
            method = decorator(method)

        return method

    def _get_decorators_for_method(self, method_name, param_name):
        if isinstance(self.method_decorators, Mapping):
            decorators = self.method_decorators.get(method_name, []).copy()
        else:
            decorators = self.method_decorators.copy()

        if method_name in self.exclude_decorators or method_name not in self.include_decorators:
            return reversed(decorators)

        if method_name == LIST:
            decorators.append(partial(list_loader, model=self.model))
        elif method_name in {GET, DELETE}:
            decorators.append(partial(param_converter, **{param_name: self.model}))
        elif method_name in {PATCH, PUT}:
            decorators.append(partial(param_converter,
                                      **{param_name: {'instance': self.model}}))

        if method_name == PATCH:
            decorators.append(partial(patch_loader, serializer=self.serializer))
        elif method_name == CREATE:
            decorators.append(partial(post_loader, serializer=self.serializer_create))
        elif method_name == PUT:
            decorators.append(partial(put_loader, serializer=self.serializer))

        # reverse the decorators so that they get applied in the top-to-bottom
        # order they were specified in
        return reversed(decorators)
