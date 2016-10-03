from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_refresh_token_required,
    get_jwt_identity,
)
from .models import User


auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = User.get_by_username_and_password(username, password)
    if not user:
        return jsonify({
            'msg': 'Invalid login credentials.',
        }), 401

    return jsonify({
        'access_token': create_access_token(identity=user.id, fresh=True),
        'refresh_token': create_refresh_token(identity=user.id),
    }), 200


@auth.route('/fresh-login', methods=['POST'])
def fresh_login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    user = User.get_by_username_and_password(username, password)
    if not user:
        return jsonify({
            'msg': 'Invalid login credentials.',
        }), 401

    return jsonify({
        'access_token': create_access_token(identity=user.id, fresh=True),
        # do NOT return a refresh token here!
    }), 200


@auth.route('/refresh', methods=['POST'])
@jwt_refresh_token_required
def refresh():
    user_id = get_jwt_identity()
    return jsonify({
        'access_token': create_access_token(identity=user_id, fresh=False),
        # do NOT return a refresh token here!
    }), 200
