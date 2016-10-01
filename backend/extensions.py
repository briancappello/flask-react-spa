from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from .auth.jwt import get_jwt as JWT


bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate(db=db)
jwt = JWT()
