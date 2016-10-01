import click


@click.group()
def auth():
    """Auth commands yo"""


@auth.command()
def foobar():
    """foobar command yo"""
    click.echo('running foobar')
