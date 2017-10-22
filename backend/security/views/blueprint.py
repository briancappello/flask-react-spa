from flask import Blueprint, url_for
from flask_admin import helpers as admin_helpers

from backend.extensions.admin import admin


# blueprint must be named security for compatibility with Flask-Security
security = Blueprint('security', __name__, url_prefix='/auth',
                     template_folder='templates')

# a bit of a hack so we can use flask's url_for to generate links to the
# frontend router (useful for email templates)
frontend = Blueprint('frontend', __name__)


@security.context_processor
def admin_security_context_processor():
    return dict(admin_base_template=admin.base_template,
                admin_view=admin.index_view,
                h=admin_helpers,
                get_url=url_for)
