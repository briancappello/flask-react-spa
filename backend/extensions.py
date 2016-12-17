from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_login import LoginManager

bcrypt = Bcrypt()
db = SQLAlchemy(metadata=MetaData(naming_convention={
    'ix': 'ix_%(column_0_label)s',
    'uq': 'uq_%(table_name)s_%(column_0_name)s',
    'ck': 'ck_%(table_name)s_%(constraint_name)s',
    'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
    'pk': 'pk_%(table_name)s',
}))
migrate = Migrate(db=db, render_as_batch=True)
jwt = JWTManager()
login_manager = LoginManager()
