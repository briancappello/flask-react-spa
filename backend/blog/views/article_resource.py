from backend.api import ModelResource, GET, LIST
from backend.extensions import api

from .blueprint import blog
from ..models import Article


@api.bp_model_resource(blog, Article, '/articles', '/articles/<slug>')
class ArticleResource(ModelResource):
    include_methods = (GET, LIST)
    include_decorators = (GET,)

    def get(self, article):
        # Article.get_prev_next_by_slug(article.slug)
        return article

    def list(self):
        return Article.get_published()
