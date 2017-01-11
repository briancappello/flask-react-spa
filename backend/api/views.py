from flask import Blueprint, jsonify
from ..auth import auth_required


api = Blueprint('api', __name__)


@auth_required
@api.route('/test')
def test():
    return jsonify({
        'key': 'TOP SECRET!',
    })
