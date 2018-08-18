from flask_unchained.bundles.api import ModelResource

from ..models import Series


class SeriesResource(ModelResource):
    model = Series
    include_methods = ('get', 'list')
