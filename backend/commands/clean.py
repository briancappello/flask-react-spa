# This command is adapted to click from Flask-Script 0.4.0

import click
import os

from flask.cli import cli


@cli.command()
def clean():
    """Recursively remove *.pyc and *.pyo files."""
    for dirpath, dirnames, filenames in os.walk('.'):
        for filename in filenames:
            if filename.endswith('.pyc') or filename.endswith('.pyo'):
                filepath = os.path.join(dirpath, filename)
                click.echo(f'Removing {filepath}')
                os.remove(filepath)
