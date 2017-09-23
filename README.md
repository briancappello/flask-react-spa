# Flask React SPA

A **production-ready** boilerplate built with **Python 3**, **Flask** and **ES6 React**.

## [React](https://facebook.github.io/react/) Frontend

- [Redux](http://redux.js.org/), [Redux-Form](https://redux-form.com) and [Redux-Saga](https://redux-saga.js.org/) for handling state and side effects
- [React Router v4](https://reacttraining.com/react-router/web)
- [Webpack 3](https://webpack.js.org/), [Babel 6](https://babeljs.io/), and Hot Module Reloading

## [Flask](http://flask.pocoo.org/) Backend

- [SQLAlchemy](http://docs.sqlalchemy.org/en/rel_1_1/) ORM with [Flask-SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.2/) and migrations provided by [Alembic](http://alembic.zzzcomputing.com/en/latest/) via [Flask-Migrate](http://flask-migrate.readthedocs.io/en/latest/)
- RESTful APIs provided by a customized integration between [Flask-RESTful](http://flask-restful.readthedocs.io/en/latest/) and [Flask-Marshmallow](http://flask-marshmallow.readthedocs.io/en/latest/)
- [Flask-Security](https://flask-security.readthedocs.io/en/latest/) provides authentication, authorization, registration and change/forgot password functionality
   - User session management via [Flask-Login](https://flask-login.readthedocs.io/en/latest/)
   - User permissions and roles via [Flask-Principal](https://pythonhosted.org/Flask-Principal/)
   - Secrets encryption via [passlib](https://passlib.readthedocs.io/en/stable/) and [itsdangerous](https://pythonhosted.org/itsdangerous/)
   - CSRF protection and forms via [Flask-WTF](https://flask-wtf.readthedocs.io/en/stable/)
- [Flask-Session](http://pythonhosted.org/Flask-Session/) for server-side sessions
- [Celery](http://www.celeryproject.org/) for asynchronous tasks, such as sending emails via [Flask-Mail](https://pythonhosted.org/Flask-Mail/)

## Ansible Production Deployment

- CentOS/RHEL 7.x
- Python 3.6 (provided by the [IUS Project](https://ius.io/))
- PostgreSQL 9.6
- Redis 3.2
- NGINX + uWSGI
- Lets Encrypt HTTPS
- Email via Postfix with SSL and OpenDKIM

### Local Development QuickStart:

Dependencies:

- Python 3.5+
- Your virtualenv tool of choice (not strictly required but strongly recommended)
- An SQL database: SQLite, MySQL/MariaDB, or PostgreSQL
- Redis (used for sessions persistence and the Celery tasks queue)
- node.js & npm (v6 or later recommended, only required for development)

```bash
# install
$ git clone git@github.com:briancappello/flask-react-spa.git
$ cd flask-react-spa
$ mkvirtualenv -p /path/to/python3 flask_react_spa
$ pip install -r requirements.txt
$ npm install

# configure
$ edit `backend/config.example.py` and save as `backend/config.py`
$ edit `frontend/app/config.example.js` and save as `frontend/app/config.js`

# run db migrations
$ python manage.py db upgrade

# load db fixtures (optional)
$ python manage.py load_fixtures fixtures.json

# frontend dev server:
$ npm run start

# backend dev server:
$ python manage.py run

# backend celery workers:
$ python manage.py celery worker
$ python manage.py celery beat
```

## Full Documentation

See the `/docs` folder.

FIXME: publish to GitHub Pages.

## License

MIT
