from flask_unchained.bundles.sqlalchemy import db

from .series_article import SeriesArticle
from .series_tag import SeriesTag


@db.slugify('title')
@db.attach_events
class Series(db.Model):
    title = db.Column(db.String(100))
    slug = db.Column(db.String(100))
    file_path = db.Column(db.String(255), nullable=True)
    header_image = db.Column(db.String(255), nullable=True)
    summary = db.Column(db.Text)

    series_articles = db.relationship('SeriesArticle', back_populates='series',
                                      lazy='joined', innerjoin=True,
                                      order_by='SeriesArticle.part',
                                      cascade='all, delete-orphan')
    articles = db.association_proxy('series_articles', 'article',
                                    creator=lambda article: SeriesArticle(article=article))

    category_id = db.foreign_key('Category', nullable=True)
    category = db.relationship('Category', back_populates='series')

    series_tags = db.relationship('SeriesTag', back_populates='series',
                                  cascade='all, delete-orphan')
    tags = db.association_proxy('series_tags', 'tag',
                                creator=lambda tag: SeriesTag(tag=tag))

    __repr_props__ = ('id', 'title', 'articles')

    @db.on('series_articles', 'append')
    def on_append_series_article(self, series_article, *_):
        # auto increment series article part number if necessary
        if series_article.part is None:
            series_article.part = len(self.series_articles) + 1

        # set the article's category to be the same as the series' category
        article = series_article.article
        article.category = self.category

        # set the article's tags to include the series' tags
        for tag in self.tags:
            if tag not in article.tags:
                article.tags.append(tag)
