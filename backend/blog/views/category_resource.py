from backend.api import ModelResource, GET, LIST
from backend.extensions import api

from .blueprint import blog
from ..models import Article, Category, Series


@api.bp_model_resource(blog, Category, '/categories', '/categories/<slug>')
class CategoryResource(ModelResource):
    include_methods = (GET, LIST)

    def get(self, category):
        return self.serializer.dump({
            'name': category.name,
            'slug': category.slug,
            'series': Series.filter_by(category=category).all(),
            'articles': Article.filter_by(category=category, series=None).all(),
        })
