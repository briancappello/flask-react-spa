import pytest

from flask_login import current_user
# from flask_unchained.bundles.security.pytest import api_client


@pytest.mark.usefixtures('user')
class TestChangePassword:
    def test_auth_required(self, api_client):
        r = api_client.post('security.change_password')
        assert r.status_code == 401

    def test_fields_required(self, api_client):
        api_client.login_user()
        r = api_client.post('security.change_password')
        assert r.status_code == 400, r.json
        assert 'password' in r.errors
        assert 'new_password' in r.errors
        assert 'new_password_confirm' in r.errors

    def test_min_length(self, api_client):
        api_client.login_user()
        r = api_client.post('security.change_password',
                            data=dict(password='password',
                                      new_password='fail',
                                      new_password_confirm='fail'))
        assert 'new_password' in r.errors
        assert 'Password must be at least 8 characters long.' in r.errors['new_password']

    def test_new_passwords_match(self, api_client):
        api_client.login_user()
        r = api_client.post('security.change_password',
                            data=dict(password='password',
                                      new_password='long enough',
                                      new_password_confirm='but no match'))
        assert 'new_password_confirm' in r.errors
        assert 'Passwords do not match.' in r.errors['new_password_confirm']

    def test_new_same_as_the_old(self, api_client):
        api_client.login_user()
        r = api_client.post('security.change_password',
                            data=dict(password='password',
                                      new_password='password',
                                      new_password_confirm='password'))
        assert 'new_password' in r.errors
        assert 'Your new password must be different than your previous password.' in r.errors['new_password']

    def test_valid_new_password(self, api_client, user):
        api_client.login_user()
        r = api_client.post('security.change_password',
                            data=dict(password='password',
                                      new_password='new password',
                                      new_password_confirm='new password'))
        assert r.status_code == 200
        assert 'token' in r.json

        api_client.logout()
        api_client.login_with_creds('user@example.com', 'new password')
        assert current_user == user
