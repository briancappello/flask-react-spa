from http import HTTPStatus
from flask import abort
from flask_login import current_user, login_user, logout_user
from flask_principal import identity_loaded, RoleNeed
from flask_security import Security as BaseSecurity
from flask_security.core import _context_processor
from flask_security.signals import user_confirmed
from werkzeug.local import LocalProxy

from backend.config import ROLE_HIERARCHY
from backend.tasks import send_mail_async_task

from .forms import ChangePasswordForm, ResetPasswordForm


class Security(BaseSecurity):
    """The :class:`Security` class initializes the Flask-Security extension.

    Overridden to support the application factory pattern.

    __init__ supports all the kwargs upstream only supports via init_app, and
    init_app does not override the arguments to __init__ as upstream does
    """
    def __init__(self, app=None, datastore=None, **kwargs):
        self._kwargs = {
            # disable flask_security's views (their json handling isn't so great)
            # instead we provide our own views in backend.security.views
            'register_blueprint': False,

            # set an optional custom anonymous user class
            'anonymous_user': None,

            # set custom forms (NOTE: we don't always use Flask-Security forms,
            # instead sometimes Marshmallow serializers are used)
            'login_form': None,
            'change_password_form': ChangePasswordForm,
            'reset_password_form': ResetPasswordForm,
        }
        self._kwargs.update(kwargs)
        super().__init__(app, datastore, **self._kwargs)

    def init_app(self, app):
        self._state = super().init_app(app, self.datastore, **self._kwargs)

        # override the unauthorized action to use abort(401) instead of returning HTML
        self._state.unauthorized_handler(unauthorized_handler)

        # register a celery task to send emails asynchronously
        self._state.send_mail_task(send_mail_async)

        # load user's role hierarchy
        identity_loaded.connect_via(app)(on_identity_loaded)

        # only activate users after they've been confirmed
        if self.confirmable:
            user_confirmed.connect_via(app)(_on_user_confirmed)

        if not self._kwargs['register_blueprint']:
            app.context_processor(_context_processor)

        app.extensions['security'] = self

    def __getattr__(self, name):
        state_value = getattr(self._state, name, None)
        if name in ('i18n_domain',):
            return state_value
        return self.app.config.get(('security_' + name).upper(), state_value)


def unauthorized_handler():
    abort(HTTPStatus.UNAUTHORIZED)


def send_mail_async(msg):
    if isinstance(msg.sender, LocalProxy):
        msg.sender = msg.sender._get_current_object()
    return send_mail_async_task.delay(msg)


def on_identity_loaded(sender, identity):
    role_names = set()
    for role in getattr(current_user, 'roles', []):
        role_names = role_names.union(set(_get_role_hierarchy(role.name)))
    for role_name in role_names:
        identity.provides.add(RoleNeed(role_name))


def _get_role_hierarchy(role_name, parent=None):
    if role_name != '__CRUD__':
        yield role_name
    else:
        for action in ['CREATE', 'VIEW', 'EDIT', 'DELETE']:
            yield f'{parent}_{action}'

    if role_name in ROLE_HIERARCHY:
        for child_role_name in ROLE_HIERARCHY[role_name]:
            yield from _get_role_hierarchy(child_role_name, role_name)


def _on_user_confirmed(sender, user):
    user.active = True
    if user != current_user:
        logout_user()
        login_user(user)
