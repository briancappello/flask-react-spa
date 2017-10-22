from flask import Blueprint

from .dashboard import AdminDashboardView


# create a blueprint so we can place templates and static files outside of
# the main app folders. unfortunately we can't just name it "admin", because
# flask_admin has already named its blueprint that, and Flask doesn't allow
# duplicate names. the only place you really have to make sure you're
# referencing "_admin" is when generating URLs to static assets, eg:
# <link href="{{ url_for('_admin.static', filename='foobar.css') }}">
admin = Blueprint('_admin', __name__, url_prefix='/_admin',
                  static_folder='static',
                  template_folder='templates')
