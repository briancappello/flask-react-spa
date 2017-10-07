import click
import json
import os
import sys

from datetime import datetime
from flask.cli import with_appcontext

from backend.config import (
    APP_CACHE_FOLDER,
    DEFAULT_ARTICLE_AUTHOR_EMAIL,
    ARTICLES_FOLDER,
)
from backend.extensions import db
from backend.security.models import User
from ...models import SeriesArticle

from ..group import blog
from .article_data import ArticleData, load_article_datas
from .series_data import load_series_datas

ARTICLES_METADATA_PATH = os.path.join(APP_CACHE_FOLDER, '.articles-metadata.json')


@blog.command()
@with_appcontext
def import_articles():
    last_updated, default_author = load_metadata()
    new_articles = load_article_datas(ARTICLES_FOLDER,
                                      default_author,
                                      last_updated)
    process_article_datas(new_articles, None)

    for series_data in load_series_datas(ARTICLES_FOLDER,
                                         default_author,
                                         last_updated):
        series, is_create = series_data.create_or_update_series()
        should_save = is_create or series_data.last_updated.timestamp() > last_updated
        if should_save:
            series.save()
        click.echo('{}Series: {}'.format(
            should_save and (is_create and 'Created ' or 'Updated ') or '',
            series.title,
        ))
        process_article_datas(series_data.articles, series)

    db.session.commit()
    save_metadata()


def process_article_datas(article_datas, series):
    for article_data in article_datas:
        article, is_create = article_data.create_or_update_article()
        article.save()
        if series and article_data.part:
            series.series_articles.append(SeriesArticle(series=series,
                                                        article=article,
                                                        part=article_data.part))
        elif series:
            series.articles.append(article)

        click.echo('{}{} Article: {}'.format(series and ' - ' or '',
                                             is_create and 'Created' or 'Updated',
                                             article.title))


def load_metadata():
    if not os.path.exists(ARTICLES_FOLDER):
        click.secho('Could not find directory ARTICLES_FOLDER'
                    '={}'.format(ARTICLES_FOLDER), fg='red')
        sys.exit(1)

    default_author = User.get_by(email=DEFAULT_ARTICLE_AUTHOR_EMAIL)
    if not default_author:
        click.secho('Could not find a User with DEFAULT_ARTICLE_AUTHOR_EMAIL'
                    '={}'.format(DEFAULT_ARTICLE_AUTHOR_EMAIL), fg='red')
        sys.exit(1)

    if not os.path.exists(ARTICLES_METADATA_PATH):
        return 0, default_author

    with open(ARTICLES_METADATA_PATH) as f:
        metadata = json.load(f)
    return metadata['last_updated'], default_author


def save_metadata():
    if not os.path.exists(os.path.dirname(ARTICLES_METADATA_PATH)):
        os.mkdir(os.path.dirname(ARTICLES_METADATA_PATH))

    data = json.dumps({'last_updated': datetime.now().timestamp()}, indent=4)
    with open(ARTICLES_METADATA_PATH, 'w') as f:
        f.write(data + '\n')
