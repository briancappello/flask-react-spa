from flask import current_app

from backend.api import ModelResource, CREATE
from backend.extensions.api import api
from backend.utils import send_mail

from .blueprint import site
from ..models import ContactSubmission


@api.model_resource(site, ContactSubmission, '/contact-submissions')
class ContactSubmissionResource(ModelResource):
    include_methods = (CREATE,)

    def create(self, contact_submission, errors):
        if errors:
            return self.errors(errors)

        send_mail(subject='New Contact Submission',
                  recipients=list(current_app.config.get('MAIL_ADMINS')),
                  template='email/contact_submission.html',
                  contact_submission=contact_submission)

        return self.created(contact_submission)
