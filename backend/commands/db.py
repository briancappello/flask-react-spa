import click

from flask import current_app
from flask.cli import with_appcontext
from flask_alembic.cli.click import cli as db_cli

from backend.utils.date import parse_datetime


# FIXME: document json file format, relationships
@db_cli.command()
@click.option('--reset/--no-reset', expose_value=True,
              prompt='Reset DB and run migrations before loading fixtures?')
@click.argument('file', type=click.File())
@with_appcontext
def fixtures(file, reset):
    """Load database fixtures from JSON."""
    import json
    from backend.extensions import db
    from backend.magic import get_bundle_models
    models = dict(get_bundle_models())

    if reset:
        _reset_db()

    # sqlalchemy and postgres sequences don't play so nice together when ids are
    # explicitly set. so we need to modify the sequence start-point ourselves
    is_postgres = current_app.config.get('SQLALCHEMY_DATABASE_URI', '').startswith('postgres')
    sequences = []
    if is_postgres:
        sequences = [row[0] for row in db.session.execute("""
            SELECT relname FROM pg_class WHERE relkind = 'S'
        """)]

    click.echo('Loading fixtures.')
    for fixture in json.load(file):
        model = models[fixture['model']]
        for model_kwargs in fixture['items']:
            d = {}
            for k, v in model_kwargs.items():
                # FIXME is this too heavy-handed of an approach? (will it ever
                # create a date when it wasn't supposed to?) maybe better to
                # somehow declare explicit date fields in the fixtures file
                try:
                    d[k] = parse_datetime(v)
                except:
                    d[k] = v
            model.create(**d)

        count = len(fixture['items'])
        click.echo('Adding %d %s record%s.' % (count, fixture['model'],
                                               's' if count > 1 else ''))

        if is_postgres:
            seq_name = '%s_id_seq' % model.__tablename__
            if seq_name in sequences:
                db.session.execute(
                    'ALTER SEQUENCE %s RESTART WITH :count' % seq_name,
                    {'count': count + 1}
                )

    db.session.commit()
    click.echo('Done.')


@db_cli.command()
@click.option('--drop/--no-drop', expose_value=True,
              prompt='Drop DB tables?')
@with_appcontext
def drop(drop):
    """Drop database tables."""
    if not drop:
        exit('Cancelled.')
    _drop_db()
    click.echo('Done.')


def _drop_db():
    from backend.extensions import db

    click.echo('Dropping DB tables.')
    db.drop_all()
    db.engine.execute('DROP TABLE IF EXISTS alembic_version;')


@db_cli.command()
@click.option('--reset', is_flag=True, expose_value=True,
              prompt='Drop DB tables and run migrations?')
@with_appcontext
def reset(reset):
    """Drops database tables and runs migrations."""
    if not reset:
        exit('Cancelled.')
    _reset_db()
    click.echo('Done.')


def _reset_db():
    from backend.extensions import alembic

    _drop_db()
    click.echo('Running DB migrations.')
    alembic.upgrade()

