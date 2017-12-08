from backend.database import (
    Column,
    Model,
    String,
    association_proxy,
    relationship,
    slugify,
)

from .article_tag import ArticleTag
from .series_tag import SeriesTag


@slugify('name')
class Tag(Model):
    name = Column(String(32))
    slug = Column(String(32))

    tag_articles = relationship('ArticleTag', back_populates='tag')
    articles = association_proxy('tag_articles', 'article',
                                 creator=lambda article: ArticleTag(article=article))

    tag_series = relationship('SeriesTag', back_populates='tag')
    series = association_proxy('tag_series', 'series',
                               creator=lambda series: SeriesTag(series=series))

    __repr_props__ = ('id', 'name')

    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name
