from backend.database import (
    Column,
    Model,
    String,
    relationship,
    slugify,
)


@slugify('name')
class Category(Model):
    name = Column(String(32))
    slug = Column(String(32))

    articles = relationship('Article', back_populates='category')
    series = relationship('Series', back_populates='category')

    __repr_props__ = ('id', 'name')

    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name
