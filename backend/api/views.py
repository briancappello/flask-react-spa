from flask import Blueprint, jsonify

from backend.decorators import auth_required


api = Blueprint('api', __name__)


@api.route('/test')
@auth_required
def test():
    return jsonify({'key': 'TOP SECRET!'})
