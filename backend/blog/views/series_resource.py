from backend.api import ModelResource, GET, LIST
from backend.extensions.api import api

from .blueprint import blog
from ..models import Series


@api.model_resource(blog, Series, '/series', '/series/<slug>')
class SeriesResource(ModelResource):
    include_methods = (GET, LIST)
