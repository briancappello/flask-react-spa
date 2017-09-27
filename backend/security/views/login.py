from flask import after_this_request, jsonify, request
from flask_security.utils import (
    config_value,
    get_message,
    login_user,
)
from flask_security.views import _security, _commit
from http import HTTPStatus
from werkzeug.datastructures import MultiDict

from backend.extensions import api

from .blueprint import security


@api.bp_route(security, '/login', methods=['POST'])
def login():
    form = _security.login_form(MultiDict(request.get_json()))

    if form.validate_on_submit():
        login_user(form.user, remember=form.remember.data)
        after_this_request(_commit)

    confirmation_required = get_message('CONFIRMATION_REQUIRED')[0]
    if confirmation_required in form.errors.get('email', []):
        return jsonify({
            'error': confirmation_required,
        }), HTTPStatus.UNAUTHORIZED
    elif form.errors:
        username_fields = config_value('USER_IDENTITY_ATTRIBUTES')
        return jsonify({
            'error': 'Invalid {} and/or password.'.format(', '.join(username_fields))
        }), HTTPStatus.UNAUTHORIZED

    return jsonify({
        'user': form.user,
        'token': form.user.get_auth_token(),
    })
