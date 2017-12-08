import html
import re

from backend.api import ModelSerializer, fields, pre_load

from ..models import ContactSubmission


class ContactSubmissionSerializer(ModelSerializer):
    email = fields.Email(required=True)

    class Meta:
        model = ContactSubmission

    @pre_load
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
