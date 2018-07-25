from flask_unchained.bundles.api import ma

from ..models import SeriesArticle

ARTICLE_SERIES_FIELDS = ('part', 'slug', 'title')


# used when serializing a list of series
class SeriesArticleSerializer(ma.ModelSerializer):
    slug = ma.Nested('ArticleSerializer', attribute='article', only='slug')
    title = ma.Nested('ArticleSerializer', attribute='article', only='title')

    class Meta:
        model = SeriesArticle
        fields = ARTICLE_SERIES_FIELDS


# used when serializing a list of articles
class ArticleSeriesSerializer(ma.ModelSerializer):
    slug = ma.Nested('SeriesSerializer', attribute='series', only='slug')
    title = ma.Nested('SeriesSerializer', attribute='series', only='title')

    class Meta:
        model = SeriesArticle
        fields = ARTICLE_SERIES_FIELDS


# used when serializing an article detail
class ArticleSeriesDetailSerializer(ArticleSeriesSerializer):
    articles = ma.Nested('SeriesArticleSerializer',
                         attribute='series.series_articles', many=True)

    class Meta:
        model = SeriesArticle
        fields = ARTICLE_SERIES_FIELDS + ('articles',)
