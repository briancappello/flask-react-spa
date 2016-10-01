from ..database import Model, Column, String
from ..extensions import bcrypt


class User(Model):
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String)

    def __init__(self, username, **kwargs):
        super(User, self).__init__(**kwargs)
        self.username = username
        if 'password' in kwargs:
            self.password = User.hash_password(kwargs['password'])

    @staticmethod
    def hash_password(password):
        return bcrypt.generate_password_hash(password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    @classmethod
    def get_by_username_and_password(cls, username, password):
        user = cls.get_by(username=username)
        if not user or not user.check_password(password):
            return None
        return user

    def __repr__(self):
        return '<User id=%d username="%s">' % (
            self.id, self.username,
        )
