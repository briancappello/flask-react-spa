from flask_sqlalchemy_bundle import ModelManager


class CategoryManager(ModelManager):
    model = 'Category'
