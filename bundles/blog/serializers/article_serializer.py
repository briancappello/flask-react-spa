from flask_unchained.bundles.api import ma

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


class ArticleSerializer(ma.ModelSerializer):
    author = ma.Nested('UserSerializer', only=('first_name', 'last_name'))
    category = ma.Nested('CategorySerializer', only=('name', 'slug'))
    series = ma.Nested('ArticleSeriesDetailSerializer', attribute='article_series')
    tags = ma.Nested('TagSerializer', only=('name', 'slug'), many=True)

    class Meta:
        model = Article
        fields = ARTICLE_FIELDS + ('html',)


@ma.serializer(many=True)
class ArticleListSerializer(ArticleSerializer):
    series = ma.Nested('ArticleSeriesSerializer', attribute='article_series')

    class Meta:
        model = Article
        fields = ARTICLE_FIELDS
