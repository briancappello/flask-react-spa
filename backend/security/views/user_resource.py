from flask import after_this_request, current_app
from flask_security.confirmable import generate_confirmation_link
from flask_security.signals import user_registered
from flask_security.utils import config_value, login_user, send_mail
from flask_security.views import _commit, _security

from backend.api import ModelResource, CREATE, GET, PATCH
from backend.extensions.api import api

from .blueprint import security
from ..decorators import anonymous_user_required, auth_required_same_user
from ..models import User


@api.model_resource(security, User, '/users', '/users/<int:id>')
class UserResource(ModelResource):
    include_methods = [CREATE, GET, PATCH]
    method_decorators = {
        CREATE: [anonymous_user_required],
        GET: [auth_required_same_user],
        PATCH: [auth_required_same_user],
    }

    def create(self, user, errors):
        if errors:
            return self.errors(errors)

        # complete registration, save user to db, and maybe log them in
        user_logged_in = register_user(user)
        if user_logged_in:
            return self.created({
                'token': user.get_auth_token(),
                'user': user,
            }, save=False)
        return self.created({'user': user}, save=False)


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
