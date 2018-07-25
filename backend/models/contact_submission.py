from flask_unchained.bundles.sqlalchemy import db


class ContactSubmission(db.Model):
    name = db.Column(db.String(64))
    email = db.Column(db.String(64))
    message = db.Column(db.Text)
