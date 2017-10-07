from backend.api import ModelResource, GET, LIST
from backend.extensions import api

from .blueprint import blog
from ..models import Series


@api.bp_model_resource(blog, Series, '/series', '/series/<slug>')
class SeriesResource(ModelResource):
    include_methods = (GET, LIST)
