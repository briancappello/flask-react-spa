from backend.api import ModelSerializer, fields
from backend.extensions.api import api

from ..models import Category

CATEGORY_FIELDS = ('id', 'name', 'slug')


class CategorySerializer(ModelSerializer):
    articles = fields.Nested('ArticleListSerializer', many=True)
    series = fields.Nested('SeriesListSerializer', many=True)

    class Meta:
        model = Category
        fields = CATEGORY_FIELDS + ('articles', 'series')


@api.serializer(many=True)
class CategoryListSerializer(CategorySerializer):
    class Meta:
        model = Category
        fields = CATEGORY_FIELDS
