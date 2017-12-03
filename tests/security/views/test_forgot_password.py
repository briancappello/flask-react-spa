import pytest
from flask import url_for


@pytest.mark.usefixtures('user')
class TestForgotPassword:
    def test_email_required(self, api_client):
        r = api_client.post(url_for('security.forgot_password'))
        assert r.status_code == 400
        assert 'email' in r.errors

    def test_valid_email_required(self, api_client):
        r = api_client.post(url_for('security.forgot_password'),
                            data=dict(email='fail'))
        assert r.status_code == 400
        assert 'email' in r.errors

    def test_anonymous_user_required(self, api_client):
        api_client.login_user()
        r = api_client.post(url_for('security.forgot_password'))
        assert r.status_code == 403

    def test_valid_request(self, user, api_client, outbox, templates):
        r = api_client.post(url_for('security.forgot_password'),
                            data=dict(email=user.email))
        assert r.status_code == 204
        assert len(outbox) == len(templates) == 1
        assert templates[0].template.name == 'security/email/reset_instructions.html'
        assert templates[0].context.get('reset_link')
