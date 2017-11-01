import click
import subprocess


@click.group()
def celery():
    """Start the celery worker and/or beat."""
    pass


@celery.command()
def worker():
    """Start the celery worker."""
    subprocess.run('celery worker -A wsgi.celery -l debug', shell=True)


@celery.command()
def beat():
    """Start the celery beat."""
    subprocess.run('celery beat -A wsgi.celery -l debug', shell=True)
