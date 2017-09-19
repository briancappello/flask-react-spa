.. _quickstart:

QuickStart
==========

Install:
--------

.. code:: bash

   git clone https://github.com/briancappello/flask-react-spa.git
   cd flask-react-spa
   mkvirtualenv -p /path/to/python3 flask_react_spa
   pip install -r requirements.txt
   npm install

Configure:
----------

* edit :file:`backend/config.example.py` and save it as :file:`backend/config.py`
* edit :file:`frontend/app/config.example.js` and save it as :file:`frontend/app/config.js`

.. code:: bash

   # run db migrations
   python manage.py db upgrade

   # load db fixtures (optional)
   python manage.py load_fixtures fixtures.json

Run:
----

.. code:: bash

   # frontend dev server:
   npm start  # short for: npm run start

   # backend dev server:
   python manage.py run

   # backend celery workers:
   python manage.py celery worker
   python manage.py celery beat
