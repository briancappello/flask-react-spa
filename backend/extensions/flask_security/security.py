from flask_security import Security as BaseSecurity


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
        self._state = super(Security, self).init_app(app, self.datastore, **self._kwargs)
