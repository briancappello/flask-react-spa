.. _api:

API Docs
========

Configuration
-------------

These classes can be found in the :file:`backend/config.py` file, and should
be customized to your needs.

.. autoclass:: backend.config.BaseConfig

Configuration options common to all environments.

.. autoclass:: backend.config.DevConfig

Configuration options for running in the development environment.

.. autoclass:: backend.config.ProdConfig

Configuration options for running in the production environment.

.. autoclass:: backend.config.TestConfig

Configuration options for running in the test environment.


App Factory
-----------

.. autofunction:: backend.app.create_app

.. autofunction:: backend.app._create_app


Database
--------

.. autofunction:: backend.database.foreign_key

.. autoclass:: backend.database.Model
   :members: __repr_props__, get, get_by, filter_by, create, update, save, delete
   :undoc-members: __repr_props__
   :special-members: __repr_props__
