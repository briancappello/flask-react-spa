from flask import after_this_request, jsonify, redirect, request
from flask_security.utils import (
    config_value,
    get_message,
    get_post_login_redirect,
    login_user,
)
from flask_security.views import _security, _commit, _ctx
from http import HTTPStatus
from werkzeug.datastructures import MultiDict

from backend.extensions.api import api

from .blueprint import frontend, security


@frontend.route('/login')
@api.route(security, '/login', methods=['POST'])
@security.route('/login', methods=['GET', 'POST'])
def login():
    if request.is_json:
        form = _security.login_form(MultiDict(request.get_json()))
    else:
        form = _security.login_form(request.form)

    if form.validate_on_submit():
        login_user(form.user, remember=form.remember.data)
        after_this_request(_commit)

        if not request.is_json:
            return redirect(get_post_login_redirect(form.next.data))

    if not request.is_json:
        return _security.render_template(config_value('LOGIN_USER_TEMPLATE'),
                                         login_user_form=form,
                                         **_ctx('login'))

    # override error messages if necessary
    confirmation_required = get_message('CONFIRMATION_REQUIRED')[0]
    if confirmation_required in form.errors.get('email', []):
        return jsonify({
            'error': confirmation_required,
        }), HTTPStatus.UNAUTHORIZED
    elif form.errors:
        username_fields = config_value('USER_IDENTITY_ATTRIBUTES')
        return jsonify({
            'error': f"Invalid {', '.join(username_fields)} and/or password."
        }), HTTPStatus.UNAUTHORIZED

    return jsonify({
        'user': form.user,
        'token': form.user.get_auth_token(),
    })
