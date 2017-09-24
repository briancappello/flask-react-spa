from backend.database import (
    BaseModel,
    foreign_key,
    relationship,
)


class UserRole(BaseModel):
    """Join table between User and Role"""
    __tablename__ = 'user_role'
    user_id = foreign_key('user', primary_key=True)
    role_id = foreign_key('role', primary_key=True)

    user = relationship('User', back_populates='user_roles')
    role = relationship('Role', back_populates='role_users')

    __repr_props__ = ('user_id', 'role_id')

    def __init__(self, user=None, role=None, **kwargs):
        super(UserRole, self).__init__(**kwargs)
        if user:
            self.user = user
        if role:
            self.role = role
