from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_login import LoginManager

bcrypt = Bcrypt()
db = SQLAlchemy()
migrate = Migrate(db=db)
jwt = JWTManager()
login_manager = LoginManager()
