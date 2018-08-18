from flask_unchained.bundles.api import ModelResource
from flask_unchained import injectable

from ..models import Category
from ..services import ArticleManager, SeriesManager


class CategoryResource(ModelResource):
    model = Category
    include_methods = ('get', 'list')

    def __init__(self,
                 article_manager: ArticleManager = injectable,
                 series_manager: SeriesManager = injectable):
        super().__init__()
        self.article_manager = article_manager
        self.series_manager = series_manager

    def get(self, category):
        return self.serializer.dump({
            'name': category.name,
            'slug': category.slug,
            'series': self.series_manager.find_by_category(category),
            'articles': self.article_manager.find_by_category(category),
        })
