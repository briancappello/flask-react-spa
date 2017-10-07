from backend.database import (
    Column,
    Model,
    String,
    Text,
    association_proxy,
    attach_events,
    foreign_key,
    on,
    relationship,
    slugify,
)

from .series_article import SeriesArticle
from .series_tag import SeriesTag


@slugify('title')
@attach_events
class Series(Model):
    title = Column(String(100))
    slug = Column(String(100))
    file_path = Column(String(255), nullable=True)
    header_image = Column(String(255), nullable=True)
    summary = Column(Text)

    series_articles = relationship('SeriesArticle', back_populates='series',
                                   lazy='joined', innerjoin=True,
                                   order_by='SeriesArticle.part',
                                   cascade='all, delete-orphan')
    articles = association_proxy('series_articles', 'article',
                                 creator=lambda article: SeriesArticle(article=article))

    category_id = foreign_key('Category', nullable=True)
    category = relationship('Category', back_populates='series')

    series_tags = relationship('SeriesTag', back_populates='series',
                               cascade='all, delete-orphan')
    tags = association_proxy('series_tags', 'tag',
                             creator=lambda tag: SeriesTag(tag=tag))

    __repr_props__ = ('id', 'title', 'articles')

    @on('series_articles', 'append')
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
