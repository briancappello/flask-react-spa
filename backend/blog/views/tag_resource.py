from backend.api import ModelResource, GET, LIST
from backend.extensions import api

from .blueprint import blog
from ..models import Article, ArticleTag, Series, SeriesTag, Tag


@api.bp_model_resource(blog, Tag, '/tags', '/tags/<slug>')
class TagResource(ModelResource):
    include_methods = (GET, LIST)

    def get(self, tag):
        return self.serializer.dump({
            'name': tag.name,
            'slug': tag.slug,
            'series': Series.join(SeriesTag)
                            .filter(Tag.id.in_([tag.id]))
                            .all(),
            'articles': Article.filter_by(series=None)
                               .join(ArticleTag)
                               .filter(Tag.id.in_([tag.id]))
                               .all(),
        })
