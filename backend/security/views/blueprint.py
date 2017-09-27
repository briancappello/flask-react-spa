from flask import Blueprint

# blueprint must be named security for compatibility with Flask-Security
# (this way we can override its views and email templates without breaking
#  logic internal to Flask-Security)
security = Blueprint('security', __name__, url_prefix='/auth',
                     template_folder='templates')


# a bit of a hack so we can use flask's url_for to generate links to the
# frontend router (useful for email templates)
frontend = Blueprint('frontend', __name__)
