from flask import Blueprint

from .dashboard import AdminDashboardView


# create a blueprint so we can place templates and static files outside of
# the main app folders. unfortunately we can't just name it "admin", because
# flask_admin has already named its blueprint that, and Flask doesn't allow
# duplicate names. the only place you really have to make sure you're
# referencing "admin_" is when generating URLs to static assets, eg:
# <link href="{{ url_for('admin_.static', filename='foobar.css') }}">
admin = Blueprint('admin_', __name__, url_prefix='/admin_',
                  static_folder='static',
                  template_folder='templates')
