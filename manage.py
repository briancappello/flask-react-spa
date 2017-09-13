#!/usr/bin/env python
"""
This script is equivalent to the following:
FLASK_APP=wsgi.py FLASK_DEBUG=true flask

(By default, always runs with FLASK_DEBUG=true, unless --env=prod is passed or
FLASK_DEBUG is set to false, no or 0)

USAGE:
python manage.py COMMAND [OPTIONS] [ARGS] [--env=prod]
"""
import argparse
import os
import sys
import click
import time

from flask.cli import FlaskGroup
from backend.app import create_app


def production_warning(env, args):
    if len(args):
        env = 'PRODUCTION' if env == 'prod' else 'STAGING'
        cmd = ' '.join(args)
        # allow some time to cancel commands
        for i in [4, 3, 2, 1]:
            click.echo('!! %s !!: Running "%s" in %d seconds' % (env, cmd, i))
            time.sleep(1)


@click.group(cls=FlaskGroup, create_app=lambda _: create_app(), help="""\
A utility script for the Flask React SPA application.
""")
@click.option('--env', type=click.Choice(['dev', 'staging', 'prod']), default='dev')
@click.option('--warn/--no-warn', default=True)
@click.pass_context
def cli(ctx, env, warn):
    ctx.obj.data['env'] = env
    if env != 'dev' and warn:
        production_warning(env, sys.argv[2:])


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--env', default='dev')
    args, _ = parser.parse_known_args()

    if args.env == 'dev':
        os.environ['FLASK_DEBUG'] = 'true'

    cli.main(args=sys.argv[1:])
