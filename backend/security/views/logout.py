from flask_login import current_user
from flask_security.utils import logout_user
from http import HTTPStatus

from backend.extensions import api

from .blueprint import security


@api.bp_route(security, '/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return '', HTTPStatus.NO_CONTENT
