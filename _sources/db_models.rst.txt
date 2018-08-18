.. _db_models:

Database Models
===============

BaseModel
---------

.. autoclass:: backend.database.BaseModel
   :members: __repr_props__, get, get_by, filter_by, create, update, save, delete
   :undoc-members: __repr_props__
   :special-members: __repr_props__

Model
-----

.. autoclass:: backend.database.Model

Model Mixins
------------

.. autoclass:: backend.database.PrimaryKeyMixin

.. autoclass:: backend.database.TimestampMixin

Column
------

.. autoclass:: backend.database.Column

Relationships
-------------

.. autofunction:: backend.database.foreign_key

Events
------

.. autofunction:: backend.database.attach_events
.. autofunction:: backend.database.on
.. autofunction:: backend.database.slugify
