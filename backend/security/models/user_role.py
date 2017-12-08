from backend.database import (
    BaseModel,
    foreign_key,
    relationship,
)


class UserRole(BaseModel):
    """Join table between User and Role"""
    user_id = foreign_key('User', primary_key=True)
    user = relationship('User', back_populates='user_roles')

    role_id = foreign_key('Role', primary_key=True)
    role = relationship('Role', back_populates='role_users')

    __repr_props__ = ('user_id', 'role_id')

    def __init__(self, user=None, role=None, **kwargs):
        super().__init__(**kwargs)
        if user:
            self.user = user
        if role:
            self.role = role
