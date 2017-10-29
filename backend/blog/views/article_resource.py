from backend.api import ModelResource, GET, LIST
from backend.extensions.api import api

from .blueprint import blog
from ..models import Article


@api.model_resource(blog, Article, '/articles', '/articles/<slug>')
class ArticleResource(ModelResource):
    include_methods = (GET, LIST)
    include_decorators = (GET,)

    def get(self, article):
        prev, next = article.get_prev_next()
        return {'article': article,
                'prev': prev,
                'next': next}

    def list(self):
        return Article.get_published()
