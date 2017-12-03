import pytest
from flask import url_for
from flask_security import current_user, AnonymousUser


@pytest.mark.usefixtures('user')
class TestLogout:
    def test_html_logout(self, client):
        client.login_user()
        r = client.get(url_for('security.logout'))
        assert r.status_code == 302
        assert r.path == url_for('admin.index')
        assert isinstance(current_user._get_current_object(), AnonymousUser)

    def test_api_logout(self, api_client):
        api_client.login_user()
        r = api_client.get(url_for('api.logout'))
        assert r.status_code == 204
        assert isinstance(current_user._get_current_object(), AnonymousUser)
