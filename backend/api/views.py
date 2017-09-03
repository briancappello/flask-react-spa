from flask import jsonify

from backend.decorators import auth_required
from backend.extensions import api


@api.route('/test')
@auth_required
def test():
    return jsonify({'key': 'TOP SECRET!'})
