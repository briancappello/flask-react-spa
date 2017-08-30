from flask import Blueprint, request, after_this_request, jsonify
from flask_login import current_user
from backend.decorators import auth_required
from flask_security.utils import login_user, logout_user
from flask_security.views import _security, _commit
from werkzeug.datastructures import MultiDict


auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['POST'])
def login():
    form = _security.login_form(MultiDict(request.get_json()))

    if form.validate_on_submit():
        login_user(form.user, remember=form.remember.data)
        after_this_request(_commit)

    if form.errors:
        return jsonify({
            'error': 'Invalid username or password.',
        }), 401

    return jsonify({
        'user': form.user.get_security_payload(),
        'token': form.user.get_auth_token(),
    })


@auth.route('/check-auth-token')
@auth_required
def check_auth_token():
    return jsonify({'success': True})


@auth.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()

    return jsonify({
        'logout': True,
    }), 200
