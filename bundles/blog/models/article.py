from flask_unchained.bundles.sqlalchemy import db

from .series_article import SeriesArticle
from .article_tag import ArticleTag


@db.slugify('title')
class Article(db.Model):
    title = db.Column(db.String(100))
    slug = db.Column(db.String(100))
    publish_date = db.Column(db.DateTime)
    last_updated = db.Column(db.DateTime, nullable=True)
    file_path = db.Column(db.String(255), nullable=True)
    header_image = db.Column(db.String(255), nullable=True)
    preview = db.Column(db.Text)
    html = db.Column(db.Text)

    author_id = db.foreign_key('User')
    author = db.relationship('User', back_populates='articles')

    article_series_id = db.foreign_key('SeriesArticle', nullable=True)
    article_series = db.relationship('SeriesArticle', back_populates='article',
                                     cascade='all, delete-orphan', single_parent=True)
    series = db.association_proxy('article_series', 'series',
                                  creator=lambda series: SeriesArticle(series=series))
    part = db.association_proxy('article_series', 'part')

    category_id = db.foreign_key('Category', nullable=True)
    category = db.relationship('Category', back_populates='articles')

    article_tags = db.relationship('ArticleTag', back_populates='article',
                                   cascade='all, delete-orphan')
    tags = db.association_proxy('article_tags', 'tag',
                                creator=lambda tag: ArticleTag(tag=tag))

    __repr_props__ = ('id', 'title')
