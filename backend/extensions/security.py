from backend.extensions import db
from backend.security import SQLAlchemyUserDatastore, Security
from backend.security.models import User, Role

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(datastore=user_datastore)
