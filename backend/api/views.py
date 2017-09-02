from flask import jsonify

from backend.decorators import auth_required, auth_required_same_user, param_converter
from backend.auth.models import User


from backend.extensions import api


@api.route('/test')
@auth_required
def test():
    return jsonify({'key': 'TOP SECRET!'})


@api.route('/users/<int:id>')
@auth_required_same_user
@param_converter(id=User)
def show_user(user):
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
    })
