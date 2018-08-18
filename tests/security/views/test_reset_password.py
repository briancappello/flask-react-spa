import pytest

from flask import url_for
from flask_unchained.bundles.security import AnonymousUser, SecurityService, current_user


@pytest.mark.usefixtures('user')
class TestResetPassword:
    def test_anonymous_user_required(self, user, api_client, password_resets,
                                     security_service: SecurityService):
        security_service.send_reset_password_instructions(user)
        token = password_resets[0]['token']
        api_client.login_user()
        r = api_client.get('security.reset_password', token=token)
        assert r.status_code == 403

    def test_http_get_redirects_to_frontend_form(self, user, client, password_resets,
                                                 security_service: SecurityService):
        security_service.send_reset_password_instructions(user)
        assert len(password_resets) == 1
        token = password_resets[0]['token']

        r = client.get('security.reset_password', token=token)
        assert r.status_code == 302
        assert r.path == url_for('frontend.reset_password', token=token)

    @pytest.mark.options(SECURITY_RESET_PASSWORD_WITHIN='-1 seconds')
    def test_token_expired(self, user, client, password_resets, outbox, templates,
                           security_service: SecurityService):
        security_service.send_reset_password_instructions(user)
        assert len(password_resets) == 1
        token = password_resets[0]['token']

        r = client.get('security.reset_password', token=token)
        assert r.status_code == 302
        assert r.path == url_for('frontend.forgot_password')
        assert r.query == 'expired'

        assert len(outbox) == len(templates) == 2
        # first email is for the valid reset request
        assert templates[0].template.name == 'security/email/reset_instructions.html'
        assert templates[0].context.get('reset_link')
        # second email is with a new token
        assert templates[1].template.name == 'security/email/reset_instructions.html'
        assert templates[1].context.get('reset_link')
        assert templates[0].context.get('reset_link') != templates[1].context.get('reset_link')

    def test_token_invalid(self, client):
        r = client.get('security.reset_password', token='fail')
        assert r.status_code == 302
        assert r.path == url_for('frontend.forgot_password')
        assert r.query == 'invalid'

    def test_submit_errors(self, user, api_client, password_resets,
                           security_service: SecurityService):
        security_service.send_reset_password_instructions(user)
        token = password_resets[0]['token']

        r = api_client.post('security.post_reset_password', token=token)
        assert r.status_code == 400
        assert 'password' in r.errors
        assert 'password_confirm' in r.errors

        r = api_client.post('security.post_reset_password', token=token,
                            data=dict(password='short',
                                      password_confirm='short'))
        assert r.status_code == 400
        assert 'password' in r.errors
        assert 'Password must be at least 8 characters long.' in r.errors['password']

        r = api_client.post('security.post_reset_password', token=token,
                            data=dict(password='long enough',
                                      password_confirm='but not the same'))
        assert r.status_code == 400
        assert 'password_confirm' in r.errors
        assert 'Passwords do not match.' in r.errors['password_confirm']

    def test_valid_submit(self, user, api_client, password_resets, outbox, templates,
                          security_service: SecurityService):
        security_service.send_reset_password_instructions(user)
        token = password_resets[0]['token']

        r = api_client.post('security.post_reset_password', token=token,
                            data=dict(password='new password',
                                      password_confirm='new password'))
        assert r.status_code == 200
        # user should be logged in
        assert 'user' in r.json
        assert 'token' in r.json
        assert current_user == user

        assert len(outbox) == len(templates) == 2
        # first email is for the valid reset request
        assert templates[0].template.name == 'security/email/reset_instructions.html'
        assert templates[0].context.get('reset_link')
        # second email is to notify of the changed password
        assert templates[1].template.name == 'security/email/reset_notice.html'

        # make sure the password got updated in the database
        api_client.logout()
        assert isinstance(current_user._get_current_object(), AnonymousUser)
        api_client.login_with_creds(user.email, 'new password')
        assert current_user == user
