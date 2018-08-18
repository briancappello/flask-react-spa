import pytest

from flask_unchained import url_for
from flask_unchained.bundles.security import UserManager, SecurityService


@pytest.mark.usefixtures('user')
class TestResendConfirmation:
    def test_email_required(self, api_client):
        r = api_client.post('security.send_confirmation')
        assert r.status_code == 400
        assert 'email' in r.errors

    def test_cannot_reconfirm(self, user, api_client):
        r = api_client.post('security.send_confirmation',
                            data=dict(email=user.email))
        assert r.status_code == 400
        assert 'Your email has already been confirmed.' in r.errors['email']

    @pytest.mark.options(SECURITY_CONFIRMABLE=True)
    def test_instructions_resent(self, api_client, outbox, templates,
                                 user_manager: UserManager,
                                 security_service: SecurityService):
        user = user_manager.create(username='test',
                                   email='test@example.com',
                                   password='password',
                                   first_name='the',
                                   last_name='user')
        security_service.register_user(user)

        r = api_client.post('security.send_confirmation',
                            data=dict(email=user.email))
        assert r.status_code == 204
        assert len(outbox) == len(templates) == 2
        assert templates[0].template.name == 'security/email/welcome.html'
        assert templates[1].template.name == 'security/email/confirmation_instructions.html'
        assert templates[0].context.get('confirmation_link') != templates[1].context.get('confirmation_link')
