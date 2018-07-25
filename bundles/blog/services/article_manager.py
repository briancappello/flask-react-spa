from flask_unchained.bundles.sqlalchemy import ModelManager
from typing import *

from backend.utils import utcnow
from ..models import Article, ArticleTag, Category, Series, Tag


class ArticleManager(ModelManager):
    model = Article

    def find_published(self):
        return (self.q
                .filter(Article.publish_date <= utcnow())
                .order_by(Article.publish_date.desc(),
                          Article.last_updated.desc())
                .all())

    def find_by_category(self, category: Category, series=None):
        return self.q.filter_by(category=category, series=series).all()

    def find_by_tag(self, tag: Tag, series: Optional[Series] = None):
        return (self.q
                .filter_by(series=series)
                .join(ArticleTag)
                .filter(ArticleTag.tag_id == tag.id)
                .all())

    def get_prev_next(self, article: Article):
        if article.series:
            return article.get_series_prev_next()

        result = self.db.session.execute(f'''
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
        ''', {'now': utcnow(), 'slug': article.slug})

        rows = [{'slug': row[0], 'title': row[1]}
                for row in result.fetchall()]

        if len(rows) == 1:
            return None, None
        elif len(rows) == 3:
            return rows[0], rows[2]
        elif rows[0]['slug'] == article.slug:
            return None, rows[1]
        elif rows[1]['slug'] == article.slug:
            return rows[0], None

    def get_series_prev_next(self, article: Article):
        if article.series:
            series_articles = article.series.series_articles

            prev = None
            prev_i = article.part - 2
            if prev_i >= 0:
                prev = series_articles[prev_i]
                prev = {'slug': prev.article.slug, 'title': prev.article.title}

            next = None
            next_i = article.part
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
