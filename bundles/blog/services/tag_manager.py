from flask_unchained.bundles.sqlalchemy import ModelManager

from ..models import Tag


class TagManager(ModelManager):
    model = Tag
