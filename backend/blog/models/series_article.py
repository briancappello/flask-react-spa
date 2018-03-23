from backend.database import (
    Column,
    Integer,
    Model,
    foreign_key,
    relationship,
)


class SeriesArticle(Model):
    """Join table between Series and Article"""
    article = relationship('Article', back_populates='article_series',
                           uselist=False, cascade='all, delete-orphan')

    part = Column(Integer)

    series_id = foreign_key('Series')
    series = relationship('Series', back_populates='series_articles')

    __repr_props__ = ('id', 'series_id', 'part')

    def __init__(self, article=None, series=None, part=None, **kwargs):
        super().__init__(**kwargs)
        if article:
            self.article = article
        if series:
            self.series = series
        if part is not None:
            self.part = part
