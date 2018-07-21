"""Flask React SPA"""

from flask import Flask, session
from flask_unchained import AppBundle
from flask_wtf.csrf import generate_csrf


class BackendBundle(AppBundle):
    @classmethod
    def before_init_app(cls, app: Flask):
        app.url_map.strict_slashes = False

    @classmethod
    def after_init_app(cls, app: Flask):
        app.jinja_env.add_extension('jinja2_time.TimeExtension')

        # set session to use PERMANENT_SESSION_LIFETIME
        # and reset the session timer on every request
        @app.before_request
        def enable_session_timeout():
            session.permanent = True
            session.modified = True

        # send CSRF token in the cookie
        @app.after_request
        def set_csrf_cookie(response):
            if response:
                response.set_cookie('csrf_token', generate_csrf())
            return response
