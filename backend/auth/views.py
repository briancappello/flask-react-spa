from flask import Blueprint, request, jsonify
from .models import User

auth = Blueprint('auth', __name__)


@auth.route('/register/', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']

    user = User.get_by(username=username)
    if user is not None:
        return jsonify({
            'status': 'error',
            'error': 'Username taken'
        })
    if username == 'a@a.com' and password == 'pw':
        return jsonify({
            'status': 200,
            'token': 'foo'
        }), 200

    return jsonify({
        'status': 'error'
    }), 401
