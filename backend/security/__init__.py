from backend.magic import Bundle

from .datastore import SQLAlchemyUserDatastore
from .decorators import (
    anonymous_user_required,
    auth_required,
    auth_required_same_user,
    roles_required,
    roles_accepted,
)
from .extension import Security

security_bundle = Bundle(__name__,
                         admin_icon_class='glyphicon glyphicon-lock',
                         blueprint_names=('security', 'frontend'),
                         )
