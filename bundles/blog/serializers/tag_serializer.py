from flask_unchained.bundles.api import ma

from ..models import Tag

TAG_FIELDS = ('id', 'name', 'slug')


class TagSerializer(ma.ModelSerializer):
    articles = ma.Nested('ArticleListSerializer', many=True)
    series = ma.Nested('SeriesListSerializer', many=True)

    class Meta:
        model = Tag
        fields = TAG_FIELDS + ('articles', 'series')


@ma.serializer(many=True)
class TagListSerializer(TagSerializer):
    class Meta:
        model = Tag
        fields = TAG_FIELDS
