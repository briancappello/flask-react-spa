from functools import wraps
from flask_login import login_required
from flask_jwt_extended import jwt_required

from ..extensions import login_manager
from .models import User


@login_manager.user_loader
def user_from_id(user_id):
    return User.get(user_id)


def auth_required(func):
    @wraps(func)
    @login_required
    @jwt_required
    def decorated(*args, **kwargs):
        return func(*args, **kwargs)
    return decorated

