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
    model = None
    serializer = None
    serializer_create = None

    # control application of automatic model loading/deserialization decorators
    # decorators specified in method_decorators will always be applied
    include_decorators = ALL_METHODS
    exclude_decorators = []

    # control which methods to automatically support
    include_methods = ALL_METHODS
    exclude_methods = []

    @staticmethod
    def has_method(cls, method_name):
        auto_method = method_name in cls.include_methods and method_name not in cls.exclude_methods
        return auto_method or getattr(cls, method_name, None)

    def created(self, obj, save=True):
        """Convenience method for saving a model"""
        if save:
            obj.save(commit=True)
        return obj, HTTPStatus.CREATED

    def deleted(self, obj):
        """Convenience method for deleting a model"""
        obj.delete(commit=True)
        return '', HTTPStatus.NO_CONTENT

    def errors(self, errors):
        """Convenience method for returning a dictionary of errors"""
        return {'errors': errors}, HTTPStatus.BAD_REQUEST

    def updated(self, obj):
        """Convenience method for saving an updated model"""
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
                    'Unimplemented HTTP method %r (expected ModelResource method'
                    ' %s to be defined)' % (request.method, method_name)
                )

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

        if method_name == GET or method_name == DELETE:
            decorators.append(partial(param_converter, **{param_name: self.model}))
        elif method_name == LIST:
            decorators.append(partial(list_loader, model=self.model))
        elif method_name == PATCH:
            decorators.append(partial(patch_loader, serializer=self.serializer))
        elif method_name == CREATE:
            decorators.append(partial(post_loader, serializer=self.serializer_create))
        elif method_name == PUT:
            decorators.append(partial(put_loader, serializer=self.serializer))

        # reverse the decorators so that they get applied in the top-to-bottom
        # order they were specified in
        return reversed(decorators)
