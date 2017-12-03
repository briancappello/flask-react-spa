import pytest

from werkzeug.exceptions import Forbidden, Unauthorized

from backend.security.decorators import (
    anonymous_user_required,
    auth_required,
    auth_required_same_user,
    # roles_accepted,  # tested by tests for auth_required
    # roles_required,  # tested by tests for auth_required
)


class MethodCalled(Exception):
    pass


@pytest.mark.usefixtures('user')
class TestAnonymousUserDecorator:
    def test_decorated_with_without_parenthesis(self):
        @anonymous_user_required()
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        @anonymous_user_required
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

    def test_authed_user_forbidden(self, client):
        client.login_user()

        @anonymous_user_required
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

    def test_anonymous_user_allowed(self):
        @anonymous_user_required
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()


@pytest.mark.usefixtures('user')
class TestAuthRequiredDecorator:
    def test_decorated_with_without_parenthesis(self):
        @auth_required()
        def method():
            raise MethodCalled

        with pytest.raises(Unauthorized):
            method()

        @auth_required
        def method():
            raise MethodCalled

        with pytest.raises(Unauthorized):
            method()

    def test_anonymous_user_unauthorized(self):
        @auth_required
        def method():
            raise MethodCalled

        with pytest.raises(Unauthorized):
            method()

    def test_authed_user_allowed(self, client):
        client.login_user()

        @auth_required
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

    def test_with_role(self, client):
        client.login_user()

        @auth_required(role='ROLE_USER')
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

    def test_without_role(self, client):
        client.login_user()

        @auth_required(role='ROLE_FAIL')
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

    def test_with_all_roles(self, client):
        client.login_user()

        @auth_required(roles=['ROLE_USER', 'ROLE_USER1'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

    def test_without_all_roles(self, client):
        client.login_user()

        @auth_required(roles=['ROLE_USER', 'ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

    def test_with_one_of_roles(self, client):
        client.login_user()

        @auth_required(one_of=['ROLE_USER', 'ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

    def test_without_one_of_roles(self, client):
        client.login_user()

        @auth_required(one_of=['ROLE_FAIL', 'ROLE_ALSO_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

    def test_with_role_and_one_of_roles(self, client):
        client.login_user()

        @auth_required(role='ROLE_USER', one_of=['ROLE_FAIL', 'ROLE_USER1'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        @auth_required(roles=['ROLE_USER'], one_of=['ROLE_FAIL', 'ROLE_USER1'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

    def test_without_role_and_one_of_roles(self, client):
        client.login_user()

        @auth_required(role='ROLE_FAIL', one_of=['ROLE_USER'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        @auth_required(roles=['ROLE_FAIL'], one_of=['ROLE_USER'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        @auth_required(role='ROLE_USER', one_of=['ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        @auth_required(roles=['ROLE_USER'], one_of=['ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

    def test_with_role_and_and_one_of_roles(self, client):
        client.login_user()

        @auth_required(role='ROLE_USER', and_one_of=['ROLE_FAIL', 'ROLE_USER1'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        @auth_required(roles=['ROLE_USER'], and_one_of=['ROLE_FAIL', 'ROLE_USER1'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

    def test_without_role_and_and_one_of_roles(self, client):
        client.login_user()

        @auth_required(role='ROLE_FAIL', and_one_of=['ROLE_USER'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        @auth_required(roles=['ROLE_FAIL'], and_one_of=['ROLE_USER'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        @auth_required(role='ROLE_USER', and_one_of=['ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        @auth_required(roles=['ROLE_USER'], and_one_of=['ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

    def test_only_one_of_role_or_roles_allowed(self, client):
        client.login_user()

        with pytest.raises(RuntimeError) as e:
            @auth_required(role='ROLE_USER', roles=['ROLE_USER1'])
            def method():
                raise MethodCalled
        assert 'can only pass one of `role` or `roles` kwargs to auth_required' in str(e)

    def test_only_one_of_one_of_or_and_one_of_allowed(self, client):
        client.login_user()

        with pytest.raises(RuntimeError) as e:
            @auth_required(one_of=['ROLE_USER'], and_one_of=['ROLE_USER1'])
            def method():
                raise MethodCalled
        assert 'can only pass one of `one_of` or `and_one_of` kwargs to auth_required' in str(e)

    def test_works_with_token_auth(self, client, user):
        client.login_as(user)

        @auth_required(role='ROLE_USER')
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()


@pytest.mark.models('User(user, admin)')
class TestAuthRequiredSameUser:
    def test_different_user_forbidden(self, client, monkeypatch, models):
        client.login_user()
        monkeypatch.setattr('flask.request.view_args', {'id': models.admin.id})

        @auth_required_same_user
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        monkeypatch.undo()

    def test_same_user_allowed(self, client, monkeypatch, models):
        client.login_user()
        monkeypatch.setattr('flask.request.view_args', {'id': models.user.id})

        @auth_required_same_user
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        monkeypatch.undo()

    def test_non_default_parameter_name(self, client, monkeypatch, models):
        client.login_user()
        monkeypatch.setattr('flask.request.view_args', {'user_id': models.user.id})

        @auth_required_same_user('user_id')
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        monkeypatch.undo()

    def test_it_accepts_auth_required_kwargs(self, client, monkeypatch, models):
        client.login_user()
        monkeypatch.setattr('flask.request.view_args', {'id': models.user.id})

        @auth_required_same_user(role='ROLE_USER')
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        @auth_required_same_user(roles=['ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(Forbidden):
            method()

        @auth_required_same_user(one_of=['ROLE_USER', 'ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        @auth_required_same_user(role='ROLE_USER', and_one_of=['ROLE_USER1', 'ROLE_FAIL'])
        def method():
            raise MethodCalled

        with pytest.raises(MethodCalled):
            method()

        monkeypatch.undo()
