from .extension import Api
from .constants import (
    ALL_METHODS,
    CREATE,
    DELETE,
    GET,
    HEAD,
    LIST,
    PATCH,
    PUT,
    PARAM_NAME_RE,
    LAST_PARAM_NAME_RE,
)
from .decorators import param_converter
from .model_resource import ModelResource


# Flask-Restful must be initialized _AFTER_ the SQLAlchemy extension has
# been initialized, AND after all views, models, and serializers have
# been imported. This is because the @api decorators create deferred
# registrations that depend upon said dependencies having all been
# completed before Api().init_app() gets called
api = Api(prefix='/api/v1')
