from flask_unchained.bundles.api import ModelResource


class SeriesResource(ModelResource):
    model = 'Series'
    include_methods = ('get', 'list')
