"""
Flask CLI commands.

By using @cli.command(), functions are automatically registered and wrapped with appcontext

The `clean`, `lint`, `test` and `urls` commands are adapted from Flask-Script 0.4.0
"""

import os
import click
from flask import current_app
from flask.cli import cli


DIR = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.join(DIR, os.pardir)
TEST_PATH = os.path.join(PROJECT_ROOT, 'tests')


@cli.command()
@click.option('--drop', is_flag=True, expose_value=True,
              prompt='Drop ALL tables before loading fixtures?')
@click.argument('file', type=click.File())
def load_fixtures(file, drop):
    """Load database fixtures from JSON."""
    try:
        import simplejson as json
    except ImportError:
        import json

    from .extensions import db
    from .magic import get_models

    fixtures = json.load(file)
    db.init_app(current_app)
    if drop:
        click.echo('Dropping tables.')
        db.drop_all()

    click.echo('Loading fixtures.')
    db.create_all()

    models = dict(get_models())
    for fixture in fixtures:
        model = models[fixture['model']]
        # FIXME: document json file format
        # FIXME: support basic relationships
        records = [model(**d) for d in fixture['items']]
        click.echo('Adding %d %s record%s.' % (len(records), fixture['model'],
                                               's' if len(records) > 1 else ''))
        db.session.add_all(records)
    db.session.commit()
    click.echo('Done.')


@cli.command()
def test():
    """Run tests."""
    import pytest
    ret = pytest.main([TEST_PATH, '--version'])
    exit(ret)


@cli.command()
@click.option('-f', '--fix-imports', default=False, is_flag=True,
              help='Fix imports using isort, before linting')
def lint(fix_imports):
    """Run flake8."""
    from glob import glob
    from subprocess import call

    skip = ['requirements']  # FIXME: support passing these in as arguments
    root_files = glob('*.py')
    root_dirs = [name for name in next(os.walk('.'))[1] if not name.startswith('.')]
    files_and_dirs = [x for x in root_files + root_dirs if x not in skip]

    def execute_tool(desc, *args):
        command = list(args) + files_and_dirs
        click.echo('%s: %s' % (desc, ' '.join(command)))
        ret = call(command)
        if ret != 0:
            exit(ret)
    if fix_imports:
        execute_tool('Fixing import order', 'isort', '-rc')
    execute_tool('Checking code style', 'flake8')


@cli.command()
def clean():
    """Recursively remove *.pyc and *.pyo files."""
    for dirpath, dirnames, filenames in os.walk('.'):
        for filename in filenames:
            if filename.endswith('.pyc') or filename.endswith('.pyo'):
                filepath = os.path.join(dirpath, filename)
                click.echo('Removing %s' % filepath)
                os.remove(filepath)


@cli.command()
@click.argument('url')
@click.option('--method', default='GET',
              help='Method for url to match (default: GET)')
def url(url, method):
    """Show details for a specific URL."""
    from werkzeug.exceptions import MethodNotAllowed, NotFound
    try:
        rule, arguments = current_app.url_map.bind('localhost')\
            .match(url, method=method, return_rule=True)
        row = (rule.rule, rule.endpoint, _format_dict(arguments), _format_rule_options(rule))
        _print_url_rules(('Rule', 'Endpoint', 'Arguments', 'Options'), [row])
    except (NotFound, MethodNotAllowed) as e:
        _print_url_rules(('Rule',), [('<{}>'.format(e),)])


@cli.command()
@click.option('--order', default='rule',
              help='Property on Rule to order by (default: rule)')
def urls(order):
    """Show details for all URLs registered with the app."""
    rules = sorted(
        current_app.url_map.iter_rules(),
        key=lambda rule: getattr(rule, order)
    )
    rows = [
        (rule.rule, rule.endpoint, _format_rule_options(rule)) for rule in rules
    ]
    _print_url_rules(('Rule', 'Endpoint', 'Options'), rows)


def _print_url_rules(columns, rows):
    str_template = ''
    table_width = 0

    def get_column_width(idx):
        header_length = len(columns[idx])
        content_length = max(len(str(row[idx])) for row in rows)
        return content_length if content_length > header_length else header_length

    for i in range(0, len(columns)):
        col_width = get_column_width(i)
        col_template = '%-' + str(col_width) + 's'
        if i == 0:
            str_template += col_template
            table_width += col_width
        else:
            str_template += '  ' + col_template
            table_width += 2 + col_width

    click.echo(str_template % columns)
    click.echo('-' * table_width)

    for row in rows:
        click.echo(str_template % row)


def _format_rule_options(url_rule):
    options = {}

    if url_rule.methods is None:
        options['methods'] = 'None'
    else:
        methods = url_rule.methods
        methods.remove('OPTIONS')
        options['methods'] = ', '.join(sorted(list(methods)))

    if url_rule.strict_slashes:
        options['strict_slashes'] = True

    if url_rule.subdomain:
        options['subdomain'] = url_rule.subdomain

    if url_rule.host:
        options['host'] = url_rule.host

    return _format_dict(options)


def _format_dict(d):
    ret = ''
    for key, value in sorted(d.items(), key=lambda item: item[0]):
        if value is True:
            ret += '%s; ' % key
        else:
            ret += '%s: %s; ' % (key, value)
    return ret.rstrip('; ')
