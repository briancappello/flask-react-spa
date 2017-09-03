from http import HTTPStatus
from flask import abort, Blueprint, url_for
from flask_login import current_user
from flask_principal import identity_loaded, RoleNeed
from flask_security import Security as BaseSecurity
from flask_security.core import _security, url_for_security
from flask_security.utils import slash_url_suffix
from flask_security.views import confirm_email, send_confirmation
from werkzeug.routing import BuildError

from backend.config import ROLE_HIERARCHY


security_bp = Blueprint('security', 'flask_security',
                        template_folder='templates',
                        url_prefix='/auth')


class Security(BaseSecurity):
    """The :class:`Security` class initializes the Flask-Security extension.

    Overridden to support the application factory pattern.

    __init__ supports all the kwargs upstream only supports via init_app, and
    init_app does not override the arguments to __init__ as upstream does
    """
    def __init__(self, app=None, datastore=None, **kwargs):
        self._kwargs = {
            # disable flask_security's views (their json handling isn't so great)
            # instead we provide our own views in backend.auth.views
            'register_blueprint': False,

            # set an optional custom anonymous user class
            'anonymous_user': None,

            # set a custom login form (NOTE: we don't use any of the other
            # Flask-Security forms, instead Marshmallow serializers are used)
            'login_form': None,
        }
        self._kwargs.update(kwargs)
        super(Security, self).__init__(app, datastore, **self._kwargs)

    def init_app(self, app):
        # set our own config defaults before calling super().init_app
        app.config.setdefault('SECURITY_POST_CONFIRM_VIEW', '/?welcome')
        app.config.setdefault('SECURITY_CONFIRM_ERROR_VIEW', '/sign-up/resend-confirmation-email')

        self._state = super(Security, self).init_app(app, self.datastore, **self._kwargs)

        # override the unauthorized action to use abort(401) instead of returning HTML
        self._state.unauthorized_handler(unauthorized_handler)

        # load user's role hierarchy
        identity_loaded.connect_via(app)(on_identity_loaded)

        # we still need to register a blueprint under the flask_security namespace
        # so that its email templates can be loaded/extended/overwritten
        if not self._kwargs['register_blueprint']:
            if self.confirmable:
                security_bp.route(self.confirm_url,
                                  methods=['GET', 'POST'],
                                  endpoint='send_confirmation')(send_confirmation)
                security_bp.route(self.confirm_url + slash_url_suffix(self.confirm_url,
                                                                      '<token>'),
                                  methods=['GET'],
                                  endpoint='confirm_email')(confirm_email)
            app.register_blueprint(security_bp)
            app.context_processor(_context_processor)


def _context_processor():
    def url_maybe_for_security(endpoint, **kwargs):
        try:
            return url_for_security(endpoint, **kwargs)
        except BuildError:
            return url_for('auth.{}'.format(endpoint), **kwargs)
    return dict(url_for_security=url_maybe_for_security, security=_security)


def unauthorized_handler():
    abort(HTTPStatus.UNAUTHORIZED)


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
            yield '{}_{}'.format(parent, action)

    if role_name in ROLE_HIERARCHY:
        for child_role_name in ROLE_HIERARCHY[role_name]:
            yield from _get_role_hierarchy(child_role_name, role_name)
