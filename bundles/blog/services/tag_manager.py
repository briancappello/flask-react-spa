from flask_unchained.bundles.sqlalchemy import ModelManager


class TagManager(ModelManager):
    model = 'Tag'
