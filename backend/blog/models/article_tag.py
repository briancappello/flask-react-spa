from backend.database import (
    BaseModel,
    foreign_key,
    relationship,
)


class ArticleTag(BaseModel):
    """Join table between Article and Tag"""
    # __tablename__ = 'article_tag'

    article_id = foreign_key('Article', primary_key=True)
    article = relationship('Article', back_populates='article_tags')

    tag_id = foreign_key('Tag', primary_key=True)
    tag = relationship('Tag', back_populates='tag_articles')

    __repr_props__ = ('article_id', 'tag_id')

    def __init__(self, article=None, tag=None, **kwargs):
        super().__init__(**kwargs)
        if article:
            self.article = article
        if tag:
            self.tag = tag
