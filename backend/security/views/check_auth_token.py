from flask import jsonify
from flask_login import current_user

from backend.extensions.api import api

from .blueprint import security
from ..decorators import auth_required


# FIXME implement remember me functionality
@api.route(security, '/check-auth-token')
@auth_required
def check_auth_token():
    return jsonify({'user': current_user._get_current_object()})
