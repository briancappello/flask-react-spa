from flask import Blueprint, current_app, render_template

from backend.extensions import api
from backend.extensions.flask_restful import ModelResource
from backend.utils import send_mail

from .models import ContactSubmission


site = Blueprint('site', __name__, template_folder='templates')


@site.route('/')
@site.route('/<path:path>')
def index(path=None):
    return render_template('index.html')


@api.bp_model_resource(site, ContactSubmission, '/contact-submissions')
class ContactSubmissionResource(ModelResource):
    include_methods = ('create',)

    def create(self, contact_submission, errors):
        if errors:
            return self.errors(errors)

        send_mail(subject='New Contact Submission',
                  recipients=list(current_app.config.get('MAIL_ADMINS')),
                  template='email/contact_submission.html',
                  contact_submission=contact_submission)

        return self.created(contact_submission)
