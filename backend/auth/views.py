from flask import Blueprint, request, jsonify
from flask_login import (
    login_user,
    logout_user,
)
from flask_jwt_extended import (
    create_access_token,
)
from .models import User


auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = User.get_by_username_and_password(username, password)
    if not user or not login_user(user):
        return jsonify({
            'msg': 'Invalid login credentials.',
        }), 401

    return jsonify({
        'access_token': create_access_token(identity=user.id, fresh=True),
    }), 200


@auth.route('/logout')
def logout():
    logout_user()
    return jsonify({
        'logout': True,
    }), 200
