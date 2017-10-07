from datetime import datetime

from backend.database import (
    Column,
    DateTime,
    Model,
    String,
    Text,
    association_proxy,
    db,
    foreign_key,
    relationship,
    slugify,
)

from .series_article import SeriesArticle
from .article_tag import ArticleTag


@slugify('title')
class Article(Model):
    title = Column(String(100))
    slug = Column(String(100))
    publish_date = Column(DateTime)
    last_updated = Column(DateTime, nullable=True)
    file_path = Column(String(255), nullable=True)
    header_image = Column(String(255), nullable=True)
    preview = Column(Text)
    html = Column(Text)

    author_id = foreign_key('User')
    author = relationship('User', back_populates='articles')

    article_series_id = foreign_key('SeriesArticle', nullable=True)
    article_series = relationship('SeriesArticle', back_populates='article')
    series = association_proxy('article_series', 'series',
                               creator=lambda series: SeriesArticle(series=series))
    part = association_proxy('article_series', 'part')

    category_id = foreign_key('Category', nullable=True)
    category = relationship('Category', back_populates='articles')

    article_tags = relationship('ArticleTag', back_populates='article',
                                cascade='all, delete-orphan')
    tags = association_proxy('article_tags', 'tag',
                             creator=lambda tag: ArticleTag(tag=tag))

    __repr_props__ = ('id', 'title')

    @classmethod
    def get_published(cls):
        return cls.query\
            .filter(cls.publish_date <= datetime.utcnow())\
            .order_by(cls.publish_date.desc(), cls.last_updated.desc())\
            .all()

    @classmethod
    def get_prev_next_by_slug(cls, slug):
        result = db.session.execute('''
          WITH articles AS (
            SELECT
              slug,
              title,
              ROW_NUMBER() OVER (ORDER BY publish_date DESC, last_updated DESC) AS row_number
            FROM %(tablename)s
            WHERE publish_date <= :now
          )
          SELECT
            slug,
            title
          FROM articles
          WHERE row_number IN (
            SELECT
              row_number + i
            FROM articles
            CROSS JOIN (SELECT -1 AS i UNION ALL SELECT 0 UNION ALL SELECT 1) n
            WHERE slug = :slug
          )
        ''' % {'tablename': Article.__tablename__}, {'now': datetime.utcnow(),
                                                     'slug': slug})
        for row in result.fetchall():
            print(row)
