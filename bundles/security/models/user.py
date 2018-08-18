from flask_unchained.bundles.security.models import User as BaseUser
from flask_unchained.bundles.sqlalchemy import db


class User(BaseUser):
    username = db.Column(db.String(64), unique=True, index=True)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))

    articles = db.relationship('Article', back_populates='author')

    __repr_props__ = ('id', 'username', 'email')
