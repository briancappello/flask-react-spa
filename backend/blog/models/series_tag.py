from backend.database import (
    BaseModel,
    foreign_key,
    relationship,
)


class SeriesTag(BaseModel):
    """Join table between Series and Tag"""
    series_id = foreign_key('Series', primary_key=True)
    series = relationship('Series', back_populates='series_tags')

    tag_id = foreign_key('Tag', primary_key=True)
    tag = relationship('Tag', back_populates='tag_series')

    __repr_props__ = ('series_id', 'tag_id')

    def __init__(self, series=None, tag=None, **kwargs):
        super().__init__(**kwargs)
        if series:
            self.series = series
        if tag:
            self.tag = tag
