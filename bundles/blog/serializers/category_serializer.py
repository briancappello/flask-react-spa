from flask_unchained.bundles.api import ma

from ..models import Category

CATEGORY_FIELDS = ('id', 'name', 'slug')


class CategorySerializer(ma.ModelSerializer):
    articles = ma.Nested('ArticleListSerializer', many=True)
    series = ma.Nested('SeriesListSerializer', many=True)

    class Meta:
        model = Category
        fields = CATEGORY_FIELDS + ('articles', 'series')


@ma.serializer(many=True)
class CategoryListSerializer(CategorySerializer):
    class Meta:
        model = Category
        fields = CATEGORY_FIELDS
