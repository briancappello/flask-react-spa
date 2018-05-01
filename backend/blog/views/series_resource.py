from flask_api_bundle import ModelResource


class SeriesResource(ModelResource):
    model = 'Series'
    include_methods = ('get', 'list')
