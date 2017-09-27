# This command is adapted to click from Flask-Script 0.4.0

import os

from flask.cli import cli


DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(DIR, os.pardir, os.pardir))
TEST_PATH = os.path.join(PROJECT_ROOT, 'tests')


@cli.command()
def test():
    """Run tests."""
    import pytest
    ret = pytest.main([TEST_PATH, '--version'])
    exit(ret)
