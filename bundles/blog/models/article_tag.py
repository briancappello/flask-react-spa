from flask_unchained.bundles.sqlalchemy import db


class ArticleTag(db.Model):
    """Join table between Article and Tag"""
    class Meta:
        pk = None

    article_id = db.foreign_key('Article', primary_key=True)
    article = db.relationship('Article', back_populates='article_tags')

    tag_id = db.foreign_key('Tag', primary_key=True)
    tag = db.relationship('Tag', back_populates='tag_articles')

    __repr_props__ = ('article_id', 'tag_id')

    def __init__(self, article=None, tag=None, **kwargs):
        super().__init__(**kwargs)
        if article:
            self.article = article
        if tag:
            self.tag = tag
