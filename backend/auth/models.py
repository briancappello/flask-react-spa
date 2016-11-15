import uuid
from six import text_type
from ..database import Model, Column, String
from ..extensions import bcrypt


class User(Model):
    uuid = Column(String(36))
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String)

    def __init__(self, username, **kwargs):
        super(User, self).__init__(**kwargs)
        self.uuid = User.new_uuid()
        self.username = username
        if 'password' in kwargs:
            self.password = User.hash_password(kwargs['password'])

    def _repr_props_(self):
        return ['username']

    @staticmethod
    def new_uuid():
        return str(uuid.uuid4())

    @staticmethod
    def hash_password(password):
        return bcrypt.generate_password_hash(password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    @classmethod
    def get_by_username_and_password(cls, username, password):
        user = cls.get_by(username=username)
        if user and user.check_password(password):
            return user
        return None

    def get_id(self):
        return text_type(self.id)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False
