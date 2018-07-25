from flask_unchained.bundles.sqlalchemy import ModelManager

from ..models import Category, Series, SeriesTag, Tag


class SeriesManager(ModelManager):
    model = Series

    def find_by_category(self, category: Category):
        return self.q.filter_by(category=category).all()

    def find_by_tag(self, tag: Tag):
        return (self.q
                .join(SeriesTag)
                .filter(SeriesTag.tag_id == tag.id)
                .all())
