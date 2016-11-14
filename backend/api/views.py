from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


@api.route('/test')
@jwt_required
def test():
    return jsonify({
        'key': 'TOP SECRET data!',
    })
