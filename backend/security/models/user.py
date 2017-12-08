from flask_security import UserMixin
from flask_security.utils import hash_password as security_hash_password

from backend.database import (
    Boolean,
    Column,
    DateTime,
    Model,
    String,
    association_proxy,
    relationship,
)

from .user_role import UserRole


class User(Model, UserMixin):
    username = Column(String(50), unique=True, index=True)
    email = Column(String(50), unique=True, index=True)
    first_name = Column(String(32))
    last_name = Column(String(64))
    password = Column(String, nullable=True)
    active = Column(Boolean(name='active'), default=False)
    confirmed_at = Column(DateTime(), nullable=True)

    user_roles = relationship('UserRole', back_populates='user',
                              cascade='all, delete-orphan')
    roles = association_proxy('user_roles', 'role',
                              creator=lambda role: UserRole(role=role))

    articles = relationship('Article', back_populates='author')

    __repr_props__ = ('id', 'username', 'email')

    def __init__(self, hash_password=True, **kwargs):
        super().__init__(**kwargs)
        if 'password' in kwargs and hash_password:
            self.password = security_hash_password(kwargs['password'])
