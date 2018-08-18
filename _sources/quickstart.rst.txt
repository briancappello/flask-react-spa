.. _quickstart:

QuickStart
==========

Clone & Configure
-----------------

.. code:: bash

   $ git clone git@github.com:briancappello/flask-react-spa.git
   $ cd flask-react-spa

* edit :file:`backend/config.example.py` and save as :file:`backend/config.py`
* edit :file:`frontend/app/config.example.js` and save as :file:`frontend/app/config.js`

Running with Docker
-------------------

.. code:: bash

   $ docker-compose up --build


Running Locally
---------------

This assumes you're on a reasonably standard \*nix system. Windows *might* work if you know what you're doing, but you're on your own there.

.. code:: bash

   # install dependencies into a virtual environment
   $ mkvirtualenv -p /path/to/python3 flask_react_spa
   $ pip install -r requirements.txt
   $ pip install -r requirements-dev.txt

   # run db migrations
   $ python manage.py db upgrade

   # load db fixtures (optional)
   $ python manage.py db fixtures fixtures.json

   # start frontend dev server:
   $ npm install
   $ npm run start

   # start backend dev server:
   $ python manage.py run

   # start backend celery worker (currently only required for sending emails):
   $ python manage.py celery worker
