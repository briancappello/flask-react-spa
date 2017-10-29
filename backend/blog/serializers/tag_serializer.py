from backend.api import ModelSerializer, fields
from backend.extensions.api import api

from ..models import Tag

TAG_FIELDS = ('id', 'name', 'slug')


class TagSerializer(ModelSerializer):
    articles = fields.Nested('ArticleListSerializer', many=True)
    series = fields.Nested('SeriesListSerializer', many=True)

    class Meta:
        model = Tag
        fields = TAG_FIELDS + ('articles', 'series')


@api.serializer(many=True)
class TagListSerializer(TagSerializer):
    class Meta:
        model = Tag
        fields = TAG_FIELDS
