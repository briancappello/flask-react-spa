from http import HTTPStatus
from flask import abort, Blueprint, url_for
from flask_security import Security as BaseSecurity
from flask_security.core import _security, url_for_security
from flask_security.utils import slash_url_suffix
from flask_security.views import confirm_email, send_confirmation
from werkzeug.routing import BuildError


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

            # set any custom forms here
            'login_form': None,
            'register_form': None,
            'confirm_register_form': None,
            'forgot_password_form': None,
            'reset_password_form': None,
            'change_password_form': None,
            'send_confirmation_form': None,
            'passwordless_login_form': None,
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
