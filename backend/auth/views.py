from http import HTTPStatus
from flask import after_this_request, Blueprint, jsonify, request
from flask_login import current_user
from flask_security.changeable import change_user_password
from flask_security.confirmable import send_confirmation_instructions
from flask_security.utils import config_value, get_message, login_user, logout_user
from flask_security.views import _security, _commit
from werkzeug.datastructures import MultiDict

from backend.decorators import (
    anonymous_user_required,
    auth_required,
    auth_required_same_user,
)
from backend.extensions import api
from backend.extensions.flask_restful import ModelResource
from backend.extensions.flask_security import register_user

from .models import User


auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')


@auth.route('/login', methods=['POST'])
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
            'error': 'Invalid {} or password.'.format('/'.join(username_fields))
        }), HTTPStatus.UNAUTHORIZED

    return jsonify({
        'user': form.user.get_security_payload(),
        'token': form.user.get_auth_token(),
    })


@auth.route('/check-auth-token')
@auth_required
def check_auth_token():
    return jsonify({'user': current_user._get_current_object()})


@auth.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return '', HTTPStatus.NO_CONTENT


@api.model_resource(User, '/users', '/users/<int:id>')
class UserResource(ModelResource):
    exclude_methods = ['delete', 'list']
    method_decorators = {
        'get': [auth_required_same_user],
        'patch': [auth_required_same_user],
        'put': [auth_required_same_user],
    }

    @anonymous_user_required
    def create(self, user, errors):
        if errors:
            return self.errors(errors)

        # complete registration, save user to db, and maybe log them in
        user_logged_in = register_user(user)
        if user_logged_in:
            return self.created({
                'token': user.get_auth_token(),
                'user': user,
            }, save=False)
        return self.created(user, save=False)


@auth.route('/resend-confirmation-email', methods=['POST'])
def resend_confirmation_email():
    """View function which sends confirmation instructions."""
    form = _security.send_confirmation_form(MultiDict(request.get_json()))

    if form.validate_on_submit():
        send_confirmation_instructions(form.user)

    if form.errors:
        return jsonify({'errors': form.errors}), HTTPStatus.BAD_REQUEST

    return '', HTTPStatus.NO_CONTENT


@auth.route('/change-password', methods=['POST'])
@auth_required
def change_password():
    user = current_user._get_current_object()
    form = _security.change_password_form(MultiDict(request.get_json()))

    if form.validate_on_submit():
        after_this_request(_commit)
        change_user_password(user, form.newPassword.data)

    if form.errors:
        return jsonify({'errors': form.errors}), HTTPStatus.BAD_REQUEST

    return jsonify({'token': user.get_auth_token()})
