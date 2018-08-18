from flask_unchained.bundles.sqlalchemy import ModelManager

from ..models import Category


class CategoryManager(ModelManager):
    model = Category
