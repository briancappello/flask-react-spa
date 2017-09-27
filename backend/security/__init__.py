from backend.extensions import db

from .datastore import SQLAlchemyUserDatastore
from .decorators import (
    anonymous_user_required,
    auth_required,
    auth_required_same_user,
    roles_required,
    roles_accepted,
)
from .extension import Security
from .models import User, Role

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(datastore=user_datastore)
