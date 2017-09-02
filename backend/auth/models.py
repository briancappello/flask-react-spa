from flask_security import UserMixin, RoleMixin
from flask_security.utils import hash_password as security_hash_password

from ..database import (
    association_proxy,
    backref,
    BaseModel,
    Boolean,
    Column,
    DateTime,
    foreign_key,
    Model,
    relationship,
    String,
)
from ..extensions import user_datastore


class User(Model, UserMixin):
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String)
    active = Column(Boolean(name='active'), nullable=False, default=False)
    confirmed_at = Column(DateTime())
    roles = association_proxy('user_roles', 'role')

    def __init__(self, username, email, hash_password=True, **kwargs):
        super(User, self).__init__(**kwargs)
        self.username = username
        self.email = email
        if 'password' in kwargs and hash_password:
            self.password = security_hash_password(kwargs['password'])

    def _repr_props_(self):
        return ['username', 'email']


class Role(Model, RoleMixin):
    name = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String(255))

    def _repr_props_(self):
        return ['name']


class UserRole(BaseModel):
    __tablename__ = 'user_role'
    user_id = foreign_key('user', primary_key=True)
    role_id = foreign_key('role', primary_key=True)

    # this backref allows the association_proxy on User.roles to work
    user = relationship('User', backref=backref('user_roles',
                                                cascade='all, delete-orphan'))
    role = relationship('Role')


# normally User and Role would be passed to the user_datastore constructor,
# but that doesn't play nice with the application factory pattern, so we
# finish initializing it this way instead.
# NOTE: this only works if this file is imported somewhere, which by default,
# it will be via the call to get_bundle_models() in backend/app.py
user_datastore.user_model = User
user_datastore.role_model = Role
