from flask_unchained.bundles.sqlalchemy import db


class SeriesArticle(db.Model):
    """Join table between Series and Article"""
    article = db.relationship('Article', back_populates='article_series',
                              uselist=False, cascade='all, delete-orphan')

    part = db.Column(db.Integer)

    series_id = db.foreign_key('Series')
    series = db.relationship('Series', back_populates='series_articles')

    __repr_props__ = ('id', 'series_id', 'part')

    def __init__(self, article=None, series=None, part=None, **kwargs):
        super().__init__(**kwargs)
        if article:
            self.article = article
        if series:
            self.series = series
        if part is not None:
            self.part = part
