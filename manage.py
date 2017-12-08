#!/usr/bin/env python
"""
This script is equivalent to the following:
FLASK_APP=wsgi.py FLASK_DEBUG=true flask

(By default, always runs with FLASK_DEBUG=true, unless --env=prod is passed or
FLASK_DEBUG is set to false, no or 0)

USAGE:
python manage.py [--env=prod] [--no-warn] COMMAND [OPTIONS] [ARGS]
"""
import argparse
import os
import sys
import click
import time

from flask.cli import FlaskGroup, run_command
from backend.app import create_app


def production_warning(env, args):
    if len(args):
        env = 'PRODUCTION' if env == 'prod' else 'STAGING'
        cmd = ' '.join(args)
        # allow some time to cancel commands
        for i in [4, 3, 2, 1]:
            click.echo(f'!! {env} !!: Running "{cmd}" in {i} seconds')
            time.sleep(1)


@click.group(cls=FlaskGroup,
             add_default_commands=False,
             create_app=lambda _: create_app(),
             help="""\
A utility script for the Flask React SPA application.
""")
@click.option('--env', type=click.Choice(['dev', 'prod']), default='dev',
              help='Whether to use DevConfig or ProdConfig (dev by default).')
@click.option('--warn/--no-warn', default=True,
              help='Whether or not to warn if running in production.')
@click.pass_context
def cli(ctx, env, warn):
    ctx.obj.data['env'] = env
    if env != 'dev' and warn:
        production_warning(env, sys.argv[2:])


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument('--env', default='dev')
    args, _ = parser.parse_known_args()

    if args.env == 'dev':
        os.environ['FLASK_DEBUG'] = 'true'

    cli.add_command(run_command)
    cli.main(args=sys.argv[1:])


if __name__ == '__main__':
    main()
