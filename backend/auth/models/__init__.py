from backend.extensions import user_datastore

from .role import Role
from .user import User
from .user_role import UserRole


# normally User and Role would be passed to the user_datastore constructor,
# but that doesn't play nice with the application factory pattern, so we
# finish initializing it this way instead.
# NOTE: this only works if this file is imported somewhere, which by default,
# it will be via the call to get_bundle_models() in backend/app.py
user_datastore.user_model = User
user_datastore.role_model = Role
