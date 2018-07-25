from flask_unchained.bundles.sqlalchemy import db

from .article_tag import ArticleTag
from .series_tag import SeriesTag


@db.slugify('name')
class Tag(db.Model):
    name = db.Column(db.String(32))
    slug = db.Column(db.String(32))

    tag_articles = db.relationship('ArticleTag', back_populates='tag')
    articles = db.association_proxy('tag_articles', 'article',
                                    creator=lambda article: ArticleTag(article=article))

    tag_series = db.relationship('SeriesTag', back_populates='tag')
    series = db.association_proxy('tag_series', 'series',
                                  creator=lambda series: SeriesTag(series=series))

    __repr_props__ = ('id', 'name')

    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name
