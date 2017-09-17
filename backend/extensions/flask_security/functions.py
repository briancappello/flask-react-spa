from flask import after_this_request, current_app
from flask_security.confirmable import generate_confirmation_link
from flask_security.signals import user_registered
from flask_security.utils import config_value, login_user, send_mail
from flask_security.views import _commit, _security


def register_user(user):
    """Performs the user registration process.

    Returns True if the user has been logged in, false otherwise.
    """
    if not _security.confirmable or _security.login_without_confirmation:
        user.active = True

    # confirmation token depends on having user.id set, which requires
    # the user be committed to the database
    user.save(commit=True)

    confirmation_link, token = None, None
    if _security.confirmable:
        confirmation_link, token = generate_confirmation_link(user)

    user_registered.send(current_app._get_current_object(),
                         user=user, confirm_token=token)

    if config_value('SEND_REGISTER_EMAIL'):
        send_mail(config_value('EMAIL_SUBJECT_REGISTER'), user.email,
                  'welcome', user=user, confirmation_link=confirmation_link)

    if not _security.confirmable or _security.login_without_confirmation:
        login_user(user)
        # login_user will modify the user object if _security.trackable is set,
        # but it will not request a session commit itself when it needs it :/
        after_this_request(_commit)
        return True

    return False
