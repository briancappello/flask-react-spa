from flask import Blueprint, jsonify
from flask_security import auth_token_required


api = Blueprint('api', __name__)


@api.route('/test')
@auth_token_required
def test():
    return jsonify({'key': 'TOP SECRET!'})
