.. _restful:

RESTful APIs
============

API Extension
-------------

The extension is instantiated in :file:`backend/extensions/api.py` and should
be used in views via `from backend.extensions.api import api`.

.. autoclass:: backend.api.Api
   :members: route, model_resource, serializer

ModelResource
-------------

.. autoclass:: backend.api.ModelResource
   :members: model, serializer, serializer_create, include_decorators, exclude_decorators, include_methods, exclude_methods, created, deleted, errors, updated


ModelSerializer
---------------

.. autoclass:: backend.api.ModelSerializer

WrappedSerializer
-----------------

.. autoclass:: backend.api.WrappedSerializer
