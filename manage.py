"""
This script is equivalent to the following:
FLASK_APP=app.py flask
"""
import os
from flask.cli import FlaskGroup

from app import app

cli = FlaskGroup(create_app=lambda _: app, help="""\
A utility script for the Flask API application.

Dev usage:

  %(prefix)sFLASK_DEBUG=1 python manage.py

Prod usage:

  %(prefix)spython manage.py
""" % {
    'prefix': os.name == 'posix' and '$ ' or '',
})

if __name__ == '__main__':
    cli.main()
