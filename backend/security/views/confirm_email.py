from flask import after_this_request, redirect
from flask_login import current_user
from flask_security.confirmable import (
    confirm_email_token_status,
    confirm_user,
    send_confirmation_instructions,
)
from flask_security.utils import (
    get_url,
    login_user,
    logout_user,
)
from flask_security.views import _security, _commit

from .blueprint import security


@security.route('/confirm/<token>', methods=['GET'])
def confirm_email(token):
    """View function which handles a email confirmation request."""

    expired, invalid, user = confirm_email_token_status(token)

    if not user or invalid:
        invalid = True

    already_confirmed = user is not None and user.confirmed_at is not None
    expired_and_not_confirmed = expired and not already_confirmed

    if expired_and_not_confirmed:
        send_confirmation_instructions(user)

    if invalid or expired_and_not_confirmed:
        return redirect(get_url(_security.confirm_error_view))

    if confirm_user(user):
        after_this_request(_commit)

    if user != current_user:
        logout_user()
        login_user(user)

    return redirect(get_url(_security.post_confirm_view))
