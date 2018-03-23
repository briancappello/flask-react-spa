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
from backend.utils.date import utcnow

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
    article_series = relationship('SeriesArticle', back_populates='article',
                                  cascade='all, delete-orphan', single_parent=True)
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
            .filter(cls.publish_date <= utcnow())\
            .order_by(cls.publish_date.desc(), cls.last_updated.desc())\
            .all()

    def get_series_prev_next(self):
        if self.series:
            series_articles = self.series.series_articles

            prev = None
            prev_i = self.part - 2
            if prev_i >= 0:
                prev = series_articles[prev_i]
                prev = {'slug': prev.article.slug, 'title': prev.article.title}

            next = None
            next_i = self.part
            if next_i < len(series_articles):
                next = series_articles[next_i]
                next = {'slug': next.article.slug, 'title': next.article.title}

            if prev and next:
                return prev, next
            elif prev:
                return prev, None
            elif next:
                return None, next
        return None, None

    def get_prev_next(self):
        if self.series:
            return self.get_series_prev_next()

        result = db.session.execute(f'''
          WITH articles AS (
            SELECT
              slug,
              title,
              ROW_NUMBER() OVER (ORDER BY publish_date ASC, last_updated ASC) AS row_number
            FROM {Article.__tablename__}
            WHERE publish_date <= :now AND article_series_id IS NULL
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
        ''', {'now': utcnow(), 'slug': self.slug})

        rows = [{'slug': row[0], 'title': row[1]}
                for row in result.fetchall()]

        if len(rows) == 1:
            return None, None
        elif len(rows) == 3:
            return rows[0], rows[2]
        elif rows[0]['slug'] == self.slug:
            return None, rows[1]
        elif rows[1]['slug'] == self.slug:
            return rows[0], None
