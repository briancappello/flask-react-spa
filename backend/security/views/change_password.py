from flask import after_this_request, jsonify, request
from flask_login import current_user
from flask_security.changeable import change_user_password
from flask_security.views import _security, _commit
from http import HTTPStatus
from werkzeug.datastructures import MultiDict

from backend.extensions.api import api

from .blueprint import security
from ..decorators import auth_required


@api.route(security, '/change-password', methods=['POST'])
@auth_required
def change_password():
    user = current_user._get_current_object()
    form = _security.change_password_form(MultiDict(request.get_json()))

    if form.validate_on_submit():
        after_this_request(_commit)
        change_user_password(user, form.newPassword.data)
    else:
        return jsonify({'errors': form.errors}), HTTPStatus.BAD_REQUEST

    return jsonify({'token': user.get_auth_token()})
