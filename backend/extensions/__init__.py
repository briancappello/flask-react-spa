from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect
from sqlalchemy import MetaData

from .flask_celery import FlaskCelery
from .flask_mail import Mail
from .flask_restful import Api


session = Session()
csrf = CSRFProtect()
mail = Mail()

# configure SQLAlchemy
db = SQLAlchemy(metadata=MetaData(naming_convention={
    'ix': 'ix_%(column_0_label)s',
    'uq': 'uq_%(table_name)s_%(column_0_name)s',
    'ck': 'ck_%(table_name)s_%(constraint_name)s',
    'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
    'pk': 'pk_%(table_name)s',
}))
migrate = Migrate(db=db, render_as_batch=True)

celery = FlaskCelery('backend.app')

# configure Flask-Marshmallow
# even though it's not explicit, Flask-Marshmallow depends on SQLAlchemy
# and therefore must come after it
ma = Marshmallow()

# Flask-Restful must be initialized _AFTER_ the SQLAlchemy extension has
# been initialized, AND after all views, models, and serializers have
# been imported. This is because the @api decorators create deferred
# registrations that depend upon said dependencies having all been
# completed before Api().init_app() gets called
api = Api(prefix='/api/v1')
