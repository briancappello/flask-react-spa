from flask import current_app

from flask_unchained.bundles.api import ModelResource
from flask_unchained import injectable
from flask_unchained.bundles.mail import Mail


class ContactSubmissionResource(ModelResource):
    model = 'ContactSubmission'
    include_methods = ('create',)

    def __init__(self, mail: Mail = injectable):
        super().__init__()
        self.mail = mail

    def create(self, contact_submission, errors):
        if errors:
            return self.errors(errors)

        self.mail.send(subject='New Contact Submission',
                       to=current_app.config.get('MAIL_ADMINS'),
                       template='email/new_contact_submission.html',
                       contact_submission=contact_submission)

        return self.created(contact_submission)
