from backend.api import ModelSerializer, fields
from backend.extensions.api import api

from ..models import Series

SERIES_FIELDS = ('id',
                 'title',
                 'slug',
                 'summary',
                 'articles',
                 'category',
                 'tags',
                 )


class SeriesSerializer(ModelSerializer):
    articles = fields.Nested('ArticleListSerializer', many=True)
    category = fields.Nested('CategorySerializer', only=('name', 'slug'))
    tags = fields.Nested('TagSerializer', only=('name', 'slug'), many=True)

    class Meta:
        model = Series
        fields = SERIES_FIELDS


@api.serializer(many=True)
class SeriesListSerializer(ModelSerializer):
    articles = fields.Nested('SeriesArticleSerializer', attribute='series_articles', many=True)
    category = fields.Nested('CategorySerializer', only=('name', 'slug'))
    tags = fields.Nested('TagSerializer', only=('name', 'slug'), many=True)

    class Meta:
        model = Series
        fields = SERIES_FIELDS
