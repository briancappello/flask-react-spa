from flask import jsonify, request
from flask_security.recoverable import send_reset_password_instructions
from flask_security.views import _security
from http import HTTPStatus
from werkzeug.datastructures import MultiDict

from .blueprint import frontend, security
from ..decorators import anonymous_user_required


@frontend.route('/login/forgot-password')
@security.route('/reset', methods=['POST'])
@anonymous_user_required
def forgot_password():
    """View function that handles a forgotten password request."""
    form = _security.forgot_password_form(MultiDict(request.get_json()))

    if form.validate_on_submit():
        send_reset_password_instructions(form.user)
    else:
        return jsonify({'errors': form.errors}), HTTPStatus.BAD_REQUEST

    return '', HTTPStatus.NO_CONTENT
