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
        message = html.escape(data['message'])
        message = re.sub(r'\n\n+', '\n\n', '\n'.join(map(
            str.strip,
            message.splitlines()
        )))
        data['message'] = '\n'.join(map(
            lambda p: '<p>{!s}</p>'.format(p),
            message.splitlines()
        ))
        return data
