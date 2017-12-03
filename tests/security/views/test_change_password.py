import pytest

from flask import url_for
from flask_login import current_user


@pytest.mark.usefixtures('user')
class TestChangePassword:
    def test_auth_required(self, api_client):
        r = api_client.post(url_for('api.change_password'))
        assert r.status_code == 401

    def test_fields_required(self, api_client):
        api_client.login_user()
        r = api_client.post(url_for('api.change_password'))
        assert r.status_code == 400, r.json
        assert 'password' in r.errors
        assert 'newPassword' in r.errors
        assert 'confirmNewPassword' in r.errors

    def test_min_length(self, api_client):
        api_client.login_user()
        r = api_client.post(url_for('api.change_password'),
                            data=dict(password='password',
                                      newPassword='fail',
                                      confirmNewPassword='fail'))
        assert 'newPassword' in r.errors
        assert 'Password must be at least 8 characters long.' in r.errors['newPassword']

    def test_new_passwords_match(self, api_client):
        api_client.login_user()
        r = api_client.post(url_for('api.change_password'),
                            data=dict(password='password',
                                      newPassword='long enough',
                                      confirmNewPassword='but no match'))
        assert 'confirmNewPassword' in r.errors
        assert 'Passwords do not match' in r.errors['confirmNewPassword']

    def test_new_same_as_the_old(self, api_client):
        api_client.login_user()
        r = api_client.post(url_for('api.change_password'),
                            data=dict(password='password',
                                      newPassword='password',
                                      confirmNewPassword='password'))
        assert 'newPassword' in r.errors
        assert 'Your new password must be different than your previous password.' in r.errors['newPassword']

    def test_valid_new_password(self, api_client, user):
        api_client.login_user()
        r = api_client.post(url_for('api.change_password'),
                            data=dict(password='password',
                                      newPassword='new password',
                                      confirmNewPassword='new password'))
        assert r.status_code == 200
        assert 'token' in r.json

        api_client.logout()
        api_client.login_with_creds('user', 'new password')
        assert current_user == user
