from six import text_type
from ..database import (
    Model,
    Column,
    String,
    Boolean,
    DateTime,
    relationship,
    join_table,
)
from ..extensions import user_datastore
from flask_security import UserMixin, RoleMixin
from flask_security.utils import hash_password


user_role = join_table('User', 'Role')


class User(Model, UserMixin):
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String)
    active = Column(Boolean(name='active'), nullable=False, default=False)
    confirmed_at = Column(DateTime())
    roles = relationship('Role', secondary=user_role, back_populates='users')

    def __init__(self, username, email, **kwargs):
        super(User, self).__init__(**kwargs)
        self.username = username
        self.email = email
        if 'password' in kwargs:
            self.password = User.hash_password(kwargs['password'])

    def get_id(self):
        return text_type(self.id)

    def _repr_props_(self):
        return ['username', 'email']

    @staticmethod
    def hash_password(password):
        return hash_password(password)

    def get_security_payload(self):
        """serialize user object for flask_security response payload"""
        return {
            'id': self.get_id(),
            'username': self.username,
            'email': self.email,
        }


class Role(Model, RoleMixin):
    name = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String(255))
    users = relationship('User', secondary=user_role, back_populates='roles')


# normally User and Role would be passed to the user_datastore constructor,
# but that doesn't play nice with the application factory pattern, so we
# finish initializing it this way instead.
# NOTE: this only works if this file is imported somewhere, which by default,
# it will be via the call to get_bundle_models() in backend/app.py
user_datastore.user_model = User
user_datastore.role_model = Role
