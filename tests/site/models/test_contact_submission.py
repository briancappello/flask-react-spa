import pytest

from flask_unchained.bundles.sqlalchemy import ValidationErrors

CONTACT_DATA = {'name': 'foo',
                'email': 'a@b.com',
                'message': 'hello world'}


@pytest.mark.usefixtures('db_session')
class TestContactSubmission:
    def test_name_required(self, contact_submission_manager):
        data = CONTACT_DATA.copy()
        data['name'] = None
        with pytest.raises(ValidationErrors):
            contact_submission_manager.create(**data, commit=True)

    def test_email_required(self, contact_submission_manager):
        data = CONTACT_DATA.copy()
        data['email'] = None
        with pytest.raises(ValidationErrors):
            contact_submission_manager.create(**data, commit=True)

    def test_message_required(self, contact_submission_manager):
        data = CONTACT_DATA.copy()
        data['message'] = None
        with pytest.raises(ValidationErrors):
            contact_submission_manager.create(**data, commit=True)
