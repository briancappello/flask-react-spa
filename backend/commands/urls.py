# These commands are adapted to click from Flask-Script 0.4.0
# Also extended to support displaying urls' view fn (or class) and options

import click
import inspect

from flask import current_app
from flask.cli import cli


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
        _print_url_rules(
            ('Rule', 'Endpoint', 'View', 'Arguments', 'Options'),
            [(rule.rule,
              rule.endpoint,
              _get_rule_view(rule),
              _format_dict(arguments),
              _format_rule_options(rule),
              )]
        )
    except (NotFound, MethodNotAllowed) as e:
        _print_url_rules(('Rule',), [(f'<{e}>',)])


@cli.command()
@click.option('--order', default='rule',
              help='Property on Rule to order by (default: rule)')
def urls(order):
    """List all URLs registered with the app."""
    rules = sorted(
        current_app.url_map.iter_rules(),
        key=lambda rule: getattr(rule, order)
    )
    _print_url_rules(
        ('Rule', 'Endpoint', 'View', 'Options'),
        [(rule.rule,
          rule.endpoint,
          _get_rule_view(rule),
          _format_rule_options(rule),
          ) for rule in rules]
    )


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


def _get_rule_view(rule):
    view_fn = current_app.view_functions[rule.endpoint]
    view_module = inspect.getmodule(view_fn)
    view_fn_name = view_fn.__name__
    if 'View.as_view' in view_fn.__qualname__:
        view_fn_name = view_fn.__dict__['view_class'].__name__
    return f'{view_module.__name__}:{view_fn_name}'


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
            ret += f'{key}; '
        else:
            ret += f'{key}: {value}; '
    return ret.rstrip('; ')
