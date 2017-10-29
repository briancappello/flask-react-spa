from backend.api import ModelSerializer, fields
from backend.extensions.api import api

from ..models import Article

ARTICLE_FIELDS = ('author',
                  'category',
                  'header_image',
                  'last_updated',
                  'preview',
                  'publish_date',
                  'series',
                  'slug',
                  'tags',
                  'title',
                  )


class ArticleSerializer(ModelSerializer):
    author = fields.Nested('UserSerializer', only=('first_name', 'last_name'))
    category = fields.Nested('CategorySerializer', only=('name', 'slug'))
    series = fields.Nested('ArticleSeriesDetailSerializer', attribute='article_series')
    tags = fields.Nested('TagSerializer', only=('name', 'slug'), many=True)

    class Meta:
        model = Article
        fields = ARTICLE_FIELDS + ('html',)


@api.serializer(many=True)
class ArticleListSerializer(ArticleSerializer):
    series = fields.Nested('ArticleSeriesSerializer', attribute='article_series')

    class Meta:
        model = Article
        fields = ARTICLE_FIELDS
