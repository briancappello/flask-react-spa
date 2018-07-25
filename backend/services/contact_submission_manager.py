from flask_unchained.bundles.sqlalchemy import ModelManager


class ContactSubmissionManager(ModelManager):
    model = 'ContactSubmission'
