from flask import jsonify, request
from flask_security.confirmable import send_confirmation_instructions
from flask_security.views import _security
from http import HTTPStatus
from werkzeug.datastructures import MultiDict

from backend.extensions.api import api

from .blueprint import frontend, security


@frontend.route('/sign-up/resend-confirmation-email')
@api.route(security, '/resend-confirmation-email', methods=['POST'])
def resend_confirmation_email():
    """View function which sends confirmation instructions."""
    form = _security.send_confirmation_form(MultiDict(request.get_json()))

    if form.validate_on_submit():
        send_confirmation_instructions(form.user)
    else:
        return jsonify({'errors': form.errors}), HTTPStatus.BAD_REQUEST

    return '', HTTPStatus.NO_CONTENT
