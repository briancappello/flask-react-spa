from flask_unchained.bundles.sqlalchemy import db


class SeriesTag(db.Model):
    """Join table between Series and Tag"""
    class Meta:
        pk = None

    series_id = db.foreign_key('Series', primary_key=True)
    series = db.relationship('Series', back_populates='series_tags')

    tag_id = db.foreign_key('Tag', primary_key=True)
    tag = db.relationship('Tag', back_populates='tag_series')

    __repr_props__ = ('series_id', 'tag_id')

    def __init__(self, series=None, tag=None, **kwargs):
        super().__init__(**kwargs)
        if series:
            self.series = series
        if tag:
            self.tag = tag
