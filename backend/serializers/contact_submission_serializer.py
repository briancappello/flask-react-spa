import html
import re

from flask_api_bundle import ma
from backend.models import ContactSubmission


class ContactSubmissionSerializer(ma.ModelSerializer):
    email = ma.Email(required=True)

    class Meta:
        model = ContactSubmission

    @ma.pre_load
    def message_to_html(self, data):
        if not data.get('message'):
            return None
        message = html.escape(data['message'])
        message = re.sub(r'\n\n+', '\n\n', '\n'.join(map(
            str.strip,
            message.splitlines()
        )))
        data['message'] = '\n'.join(map(
            lambda p: f'<p>{p!s}</p>',
            message.splitlines()
        ))
        return data
