import pytest

from flask import url_for
from flask_security import current_user, AnonymousUser
from flask_security.recoverable import send_reset_password_instructions


@pytest.mark.usefixtures('user')
class TestResetPassword:
    def test_anonymous_user_required(self, user, client, password_resets):
        send_reset_password_instructions(user)
        token = password_resets[0]['token']
        client.login_user()
        r = client.get(url_for('security.reset_password', token=token))
        assert r.status_code == 403

    def test_http_get_redirects_to_frontend_form(self, user, client, password_resets):
        send_reset_password_instructions(user)
        assert len(password_resets) == 1
        token = password_resets[0]['token']

        r = client.get(url_for('security.reset_password', token=token))
        assert r.status_code == 302
        assert r.path == url_for('frontend.reset_password', token=token)

    @pytest.mark.options(SECURITY_RESET_PASSWORD_WITHIN='-1 seconds')
    def test_token_expired(self, user, client, password_resets, outbox, templates):
        send_reset_password_instructions(user)
        assert len(password_resets) == 1
        token = password_resets[0]['token']

        r = client.get(url_for('security.reset_password', token=token))
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
        r = client.get(url_for('security.reset_password', token='fail'))
        assert r.status_code == 302
        assert r.path == url_for('frontend.forgot_password')
        assert r.query == 'invalid'

    def test_submit_errors(self, user, api_client, password_resets):
        send_reset_password_instructions(user)
        token = password_resets[0]['token']

        r = api_client.post(url_for('security.reset_password', token=token))
        assert r.status_code == 400
        assert 'newPassword' in r.errors
        assert 'confirmNewPassword' in r.errors

        r = api_client.post(url_for('security.reset_password', token=token),
                            data=dict(newPassword='short',
                                      confirmNewPassword='short'))
        assert r.status_code == 400
        assert 'newPassword' in r.errors
        assert 'Password must be at least 8 characters long.' in r.errors['newPassword']

        r = api_client.post(url_for('security.reset_password', token=token),
                            data=dict(newPassword='long enough',
                                      confirmNewPassword='but not the same'))
        assert r.status_code == 400
        assert 'confirmNewPassword' in r.errors
        assert 'Passwords do not match' in r.errors['confirmNewPassword']

    def test_valid_submit(self, user, api_client, password_resets, outbox, templates):
        send_reset_password_instructions(user)
        token = password_resets[0]['token']

        r = api_client.post(url_for('security.reset_password', token=token),
                            data=dict(newPassword='new password',
                                      confirmNewPassword='new password'))
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
