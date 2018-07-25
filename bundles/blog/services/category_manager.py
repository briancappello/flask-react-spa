from flask_unchained.bundles.sqlalchemy import ModelManager


class CategoryManager(ModelManager):
    model = 'Category'
