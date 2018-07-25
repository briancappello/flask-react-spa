from flask_unchained.bundles.sqlalchemy import db


@db.slugify('name')
class Category(db.Model):
    name = db.Column(db.String(32))
    slug = db.Column(db.String(32))

    articles = db.relationship('Article', back_populates='category')
    series = db.relationship('Series', back_populates='category')

    __repr_props__ = ('id', 'name')

    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name
