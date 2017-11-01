from flask import redirect, request, url_for
from flask_login import current_user
from flask_security.utils import logout_user
from http import HTTPStatus

from backend.extensions.api import api

from .blueprint import security


@api.route(security, '/logout')
@security.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()

    if not request.is_json:
        return redirect(url_for('admin.index'))

    return '', HTTPStatus.NO_CONTENT
