import click
import json
import os
import sys

from datetime import datetime
from flask.cli import with_appcontext
from flask_unchained.bundles.sqlalchemy import ModelManager
from flask_unchained import unchained, injectable

from ....security.services import UserManager
from ...config import Config
from ...services import SeriesArticleManager

from ..group import blog
from .article_data import load_article_datas
from .series_data import load_series_datas

ARTICLES_METADATA_PATH = os.path.join(Config.APP_CACHE_FOLDER,
                                      '.articles-metadata.json')


@blog.command()
@click.option('--reset', is_flag=True, default=False, expose_value=True,
              help='Ignore previously updated at timestamps.')
@with_appcontext
def import_articles(reset):
    click.echo('Importing new/updated blog articles.')
    if _import_articles(reset):
        click.echo('Done.')
    else:
        click.echo('No new articles found. Exiting.')


@unchained.inject('model_manager')
def _import_articles(reset, model_manager: ModelManager = injectable):
    last_updated, default_author = load_metadata(reset)
    new_articles = load_article_datas(Config.ARTICLES_FOLDER,
                                      default_author,
                                      last_updated)
    count = 0
    count += process_article_datas(new_articles, None, model_manager)

    for series_data in load_series_datas(Config.ARTICLES_FOLDER,
                                         default_author,
                                         last_updated):
        series, is_create = series_data.create_or_update_series()
        should_save = is_create or series_data.last_updated.timestamp() > last_updated
        if should_save:
            count += 1
            model_manager.save(series)

        msg_prefix = ('' if not should_save
                      else ('Created' if is_create else 'Updated '))
        click.echo(f'{msg_prefix}Series: {series.title}')

        count += process_article_datas(series_data.articles, series, model_manager)

    if count:
        model_manager.commit()
        save_metadata()
    return count


@unchained.inject('series_article_manager')
def process_article_datas(article_datas, series,
                          model_manager: ModelManager,
                          series_article_manager: SeriesArticleManager = injectable):
    count = -1
    for count, article_data in enumerate(article_datas):
        article, is_create = article_data.create_or_update_article()
        model_manager.save(article)
        if series and not article.article_series:
            if article_data.part:
                series.series_articles.append(
                    series_article_manager.create(series=series,
                                                  article=article,
                                                  part=article_data.part))
            else:
                series.articles.append(article)

        msg_prefix = ' - ' if series else ''
        msg_prefix += 'Created' if is_create else 'Updated'
        click.echo(f'{msg_prefix} Article: {article.title}')

    return count + 1


@unchained.inject('user_manager')
def load_metadata(reset=False, user_manager: UserManager = injectable):
    if not os.path.exists(Config.ARTICLES_FOLDER):
        click.secho('Could not find directory ARTICLES_FOLDER'
                    f'={Config.ARTICLES_FOLDER}', fg='red')
        sys.exit(1)

    default_author = user_manager.get_by(email=Config.DEFAULT_ARTICLE_AUTHOR_EMAIL)
    if not default_author:
        click.secho('Could not find a User with DEFAULT_ARTICLE_AUTHOR_EMAIL'
                    f'={Config.DEFAULT_ARTICLE_AUTHOR_EMAIL}', fg='red')
        sys.exit(1)

    if reset or not os.path.exists(ARTICLES_METADATA_PATH):
        return 0, default_author

    with open(ARTICLES_METADATA_PATH) as f:
        metadata = json.load(f)
    return metadata['last_updated'], default_author


def save_metadata():
    os.makedirs(os.path.dirname(ARTICLES_METADATA_PATH), exist_ok=True)

    data = json.dumps({'last_updated': datetime.now().timestamp()}, indent=4)
    with open(ARTICLES_METADATA_PATH, 'w') as f:
        f.write(data + '\n')
