from backend.api import ModelSerializer, fields

from ..models import SeriesArticle

ARTICLE_SERIES_FIELDS = ('part', 'slug', 'title')


# used when serializing a list of series
class SeriesArticleSerializer(ModelSerializer):
    slug = fields.Nested('ArticleSerializer', attribute='article', only='slug')
    title = fields.Nested('ArticleSerializer', attribute='article', only='title')

    class Meta:
        model = SeriesArticle
        fields = ARTICLE_SERIES_FIELDS


# used when serializing a list of articles
class ArticleSeriesSerializer(ModelSerializer):
    slug = fields.Nested('SeriesSerializer', attribute='series', only='slug')
    title = fields.Nested('SeriesSerializer', attribute='series', only='title')

    class Meta:
        model = SeriesArticle
        fields = ARTICLE_SERIES_FIELDS


# used when serializing an article detail
class ArticleSeriesDetailSerializer(ArticleSeriesSerializer):
    articles = fields.Nested('SeriesArticleSerializer', attribute='series.series_articles', many=True)

    class Meta:
        model = SeriesArticle
        fields = ARTICLE_SERIES_FIELDS + ('articles',)
