from flask import after_this_request, jsonify, redirect, request, url_for
from flask_security.recoverable import (
    reset_password_token_status,
    send_reset_password_instructions,
    update_password,
)
from flask_security.utils import login_user
from flask_security.views import _security, _commit
from http import HTTPStatus

from .blueprint import frontend, security
from ..decorators import anonymous_user_required


@frontend.route('/login/reset-password/<token>')
@security.route('/reset/<token>', methods=['GET', 'POST'])
@anonymous_user_required
def reset_password(token):
    """View function that handles a reset password request."""

    expired, invalid, user = reset_password_token_status(token)

    if invalid:
        return redirect(url_for('frontend.forgot_password') + '?invalid')
    elif expired:
        send_reset_password_instructions(user)
        return redirect(url_for('frontend.forgot_password') + '?expired')
    elif request.method == 'GET':
        return redirect(url_for('frontend.reset_password', token=token))

    form = _security.reset_password_form()

    if form.validate_on_submit():
        after_this_request(_commit)
        update_password(user, form.newPassword.data)
        login_user(user)
    else:
        return jsonify({'errors': form.errors}), HTTPStatus.BAD_REQUEST

    return jsonify({
        'token': user.get_auth_token(),
        'user': user,
    })
