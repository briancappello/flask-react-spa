import pytest

from flask import url_for
from flask_login import current_user


@pytest.mark.usefixtures('user')
class TestLogin:
    def test_html_get_login(self, client, templates):
        r = client.get(url_for('security.login'))
        assert r.status_code == 200
        assert templates[0].template.name == 'security/login_user.html'

    def test_html_login_errors(self, client, templates):
        r = client.post(url_for('security.login'),
                        data=dict(email=None, password=None))
        assert templates[0].template.name == 'security/login_user.html'
        assert b'Email not provided' in r.data
        assert b'Password not provided' in r.data

    def test_html_login_with_email(self, client, user):
        r = client.post(url_for('security.login'),
                        data=dict(email=user.email, password='password'))
        assert r.status_code == 302
        assert r.path == '/'
        assert current_user == user

    def test_html_login_with_username(self, client, user):
        r = client.post(url_for('security.login'),
                        data=dict(email=user.username, password='password'))
        assert r.status_code == 302
        assert r.path == '/'
        assert current_user == user

    def test_json_login_errors(self, api_client):
        r = api_client.post(url_for('api.login'),
                            data=dict(email=None, password=None))
        assert 'error' in r.json

    def test_json_login_with_email(self, api_client, user):
        r = api_client.post(url_for('api.login'),
                            data=dict(email=user.email, password='password'))
        assert r.status_code == 200
        assert 'user' in r.json
        assert 'token' in r.json
        assert r.json['user']['id'] == user.id
        assert current_user == user

    def test_json_login_with_username(self, api_client, user):
        r = api_client.post(url_for('api.login'),
                            data=dict(email=user.username, password='password'))
        assert r.status_code == 200
        assert 'user' in r.json
        assert 'token' in r.json
        assert r.json['user']['id'] == user.id
        assert current_user == user

    def test_active_user_required(self, api_client, user):
        user.active = False
        user.save(commit=True)
        r = api_client.post(url_for('api.login'),
                            data=dict(email=user.email, password='password'))
        assert r.status_code == 401

    @pytest.mark.options(SECURITY_CONFIRMABLE=True)
    def test_confirmed_user_required(self, api_client):
        from backend.security.models import User
        from backend.security.views.user_resource import register_user
        user = User(username='test',
                    email='test@example.com',
                    password='password',
                    first_name='the',
                    last_name='user')
        register_user(user)

        r = api_client.post(url_for('api.login'),
                            data=dict(email=user.email, password='password'))
        assert r.status_code == 401
        assert 'Email requires confirmation.' == r.json['error']
