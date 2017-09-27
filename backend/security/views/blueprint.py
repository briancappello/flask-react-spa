from flask import Blueprint

# blueprint must be named security for compatibility with Flask-Security
# (this way we can override its views and email templates without breaking
#  logic internal to Flask-Security)
security = Blueprint('security', __name__, url_prefix='/auth',
                     template_folder='templates')
