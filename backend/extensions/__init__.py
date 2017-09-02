from flask_mail import Mail
from flask_migrate import Migrate
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import CSRFProtect
from sqlalchemy import MetaData

from .flask_restful import Api
from .flask_security import Security, SQLAlchemyUserDatastore


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

# configure Flask-Security
# we cannot import the User/Role models here, or it will cause a circular
# dependency. instead, backend.auth.models imports user_datastore and
# sets the user_model/role_model attributes on the datastore itself
user_datastore = SQLAlchemyUserDatastore(db, None, None)
security = Security(datastore=user_datastore)

# Flask-Restful must be initialized _AFTER_ the SQLAlchemy extension has
# been initialized, AND after all views, models, and serializers have
# been imported. This is because the @api decorators create deferred
# registrations that depend upon said dependencies having all been run
# before Api().init_app() gets called
api = Api(prefix='/api/v1')
