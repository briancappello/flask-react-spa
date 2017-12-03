.. _commands:

Commands
========

Run `python manage.py`:

.. code-block:: none

   Usage: manage.py [OPTIONS] COMMAND [ARGS]...

     A utility script for the Flask React SPA application.

   Options:
     --env [dev|prod]    Whether to use DevConfig or ProdConfig (default dev)
     --warn / --no-warn  Whether or not to warn if running in production
     --version           Show the flask version
     --help              Show this message and exit

   Commands:
     blog    Blog bundle commands.
     celery  Start the celery worker and/or beat.
     clean   Recursively remove *.pyc and *.pyo files.
     db      Perform database migrations.
     lint    Run flake8.
     roles   Role commands.
     run     Runs a development server.
     shell   Runs a shell in the app context.
     url     Show details for a specific URL.
     urls    List all URLs registered with the app.
     users   User commands.

.. click:: backend.blog.commands:blog
   :prog: python manage.py blog
   :show-nested:

.. click:: backend.commands:celery
   :prog: python manage.py celery
   :show-nested:

.. click:: backend.commands:clean
   :prog: python manage.py clean

.. click:: backend.commands:db_cli
   :prog: python manage.py db
   :show-nested:

.. click:: backend.commands:lint
   :prog: python manage.py lint

.. click:: backend.commands:shell
   :prog: python manage.py shell

.. click:: backend.commands:url
   :prog: python manage.py url

.. click:: backend.commands:urls
   :prog: python manage.py urls
