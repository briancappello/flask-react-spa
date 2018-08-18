from flask_unchained.bundles.sqlalchemy import ModelManager

from ..models import SeriesArticle


class SeriesArticleManager(ModelManager):
    model = SeriesArticle
