import pytest

from flask import url_for


@pytest.mark.usefixtures('user')
class TestResendConfirmation:
    def test_email_required(self, api_client):
        r = api_client.post(url_for('api.resend_confirmation_email'))
        assert r.status_code == 400
        assert 'email' in r.errors

    def test_cannot_reconfirm(self, user, api_client):
        r = api_client.post(url_for('api.resend_confirmation_email'),
                            data=dict(email=user.email))
        assert r.status_code == 400
        assert 'Your email has already been confirmed.' in r.errors['email']

    @pytest.mark.options(SECURITY_CONFIRMABLE=True)
    def test_instructions_resent(self, api_client, outbox, templates):
        from backend.security.models import User
        from backend.security.views.user_resource import register_user
        user = User(username='test',
                    email='test@example.com',
                    password='password',
                    first_name='the',
                    last_name='user')
        register_user(user)

        r = api_client.post(url_for('api.resend_confirmation_email'),
                            data=dict(email=user.email))
        assert r.status_code == 204
        assert len(outbox) == len(templates) == 2
        assert templates[0].template.name == 'security/email/welcome.html'
        assert templates[1].template.name == 'security/email/confirmation_instructions.html'
        assert templates[0].context.get('confirmation_link') != templates[1].context.get('confirmation_link')
