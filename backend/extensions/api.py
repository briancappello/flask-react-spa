from backend.api import Api

# Flask-Restful must be initialized _AFTER_ the SQLAlchemy extension has
# been initialized, AND after all views, models, and serializers have
# been imported. This is because the @api decorators create deferred
# registrations that depend upon said dependencies having all been
# completed before Api('api').init_app() gets called
api = Api('api', prefix='/api/v1')
