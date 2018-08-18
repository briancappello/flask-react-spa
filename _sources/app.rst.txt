.. _app:

App Docs
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

The following methods are all automatically called by :meth:`backend.app._create_app`:

.. autofunction:: backend.app.configure_app

.. autofunction:: backend.app.register_extensions

.. autofunction:: backend.app.register_blueprints

.. autofunction:: backend.app.register_models

.. autofunction:: backend.app.register_serializers

.. autofunction:: backend.app.register_cli_commands

.. autofunction:: backend.app.register_shell_context


Bundles
-------

.. autoclass:: backend.magic.Bundle
