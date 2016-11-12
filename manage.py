#!/usr/bin/env python
"""
This script is equivalent to the following:
FLASK_APP=app.py FLASK_DEBUG=true flask

(By default, always runs with FLASK_DEBUG=true, unless --env=prod is passed or
FLASK_DEBUG is set to false, no or 0)

USAGE:
python manage.py COMMAND [OPTIONS] [ARGS] [--env=prod]
"""
import os
import sys
import click
import time
from flask.cli import FlaskGroup
from flask.helpers import get_debug_flag

from app import create_app


def production_warning(args):
    if len(args):
        # allow some time to cancel commands
        for i in [5, 4, 3, 2, 1]:
            click.echo('!!! PRODUCTION !!!: Starting "%s" in %d seconds' % (' '.join(args), i))
            time.sleep(1)


def get_args():
    """Returns a tuple of (args, is_debug)"""
    args = sys.argv[1:]
    # default to DEBUG unless production explicitly set
    if not get_debug_flag(True) or '--env=prod' in args:
        prod_args = [arg for arg in args if arg != '--env=prod']
        production_warning(prod_args)
        return prod_args, False
    return args, True


if __name__ == '__main__':
    args, is_debug = get_args()

    if is_debug:
        os.environ['FLASK_DEBUG'] = 'true'

    cli = FlaskGroup(create_app=lambda _: create_app(), help="""\
A utility script for the Flask API application.

Usage:

  %(prefix)spython manage.py COMMAND [OPTIONS] [ARGS] [--env=prod]
    """ % {
        'prefix': '$ ' if os.name == 'posix' else '',
    })

    cli.main(args=args)
