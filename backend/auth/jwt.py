from flask import jsonify
from flask_jwt import JWT

from ..logger import logger


def _authenticate(username, password):
    from .models import User
    return User.get_by_username_and_password(username, password)


def _user_for_token(payload):
    from .models import User
    return User.get(payload['identity'])


def _error_handler(error):
    """Overridden to resemble JS fetch's Response API"""
    logger.error(error)
    return jsonify({
        'status': error.status_code,
        'statusText': error.description,
    })


def get_jwt():
    jwt = JWT(authentication_handler=_authenticate,
              identity_handler=_user_for_token)
    jwt.error_handler(_error_handler)
    return jwt
