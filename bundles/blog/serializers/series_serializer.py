from flask_unchained.bundles.api import ma

from ..models import Series

SERIES_FIELDS = ('id',
                 'title',
                 'slug',
                 'summary',
                 'articles',
                 'category',
                 'tags',
                 )


class SeriesSerializer(ma.ModelSerializer):
    articles = ma.Nested('ArticleListSerializer', many=True)
    category = ma.Nested('CategorySerializer', only=('name', 'slug'))
    tags = ma.Nested('TagSerializer', only=('name', 'slug'), many=True)

    class Meta:
        model = Series
        fields = SERIES_FIELDS


@ma.serializer(many=True)
class SeriesListSerializer(ma.ModelSerializer):
    articles = ma.Nested('SeriesArticleSerializer',
                         attribute='series_articles', many=True)
    category = ma.Nested('CategorySerializer', only=('name', 'slug'))
    tags = ma.Nested('TagSerializer', only=('name', 'slug'), many=True)

    class Meta:
        model = Series
        fields = SERIES_FIELDS
