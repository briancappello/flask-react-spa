import json
import pytest

from werkzeug.exceptions import NotFound

from backend.api.decorators import (
    param_converter,
    list_loader,
    patch_loader,
    put_loader,
    post_loader,
)


@pytest.mark.models('User(user), Role(ROLE_USER)')
class TestParamConverter:
    def test_it_works(self, models):
        from backend.security.models import User, Role

        @param_converter(id=User, role_id=Role)
        def method(user, role):
            assert user == models.user
            assert role == models.ROLE_USER

        method(id=models.user.id, role_id=models.ROLE_USER.id)

    def test_custom_arg_names(self, models):
        from backend.security.models import User, Role

        @param_converter(id={'user_arg': User}, role_id={'role_arg': Role})
        def method(user_arg, role_arg):
            assert user_arg == models.user
            assert role_arg == models.ROLE_USER

        method(id=models.user.id, role_id=models.ROLE_USER.id)

    def test_404_on_lookup_error(self, models):
        from backend.security.models import User, Role

        @param_converter(id=User, role_id=Role)
        def method(user, role):
            assert False

        with pytest.raises(NotFound):
            method(id=0, role_id=models.ROLE_USER.id)

        @param_converter(id=User, role_id=Role)
        def method(user, role):
            assert False

        with pytest.raises(NotFound):
            method(id=models.user.id, role_id=0)

    def test_query_param_simple_type_conversion(self, app):
        with app.test_request_context('/?something=42'):
            @param_converter(something=int)
            def method(something):
                assert something == 42
            method()

    def test_query_param_dict_lookup(self, app):
        with app.test_request_context('/?something=foo'):
            @param_converter(something={'foo': 'bar'})
            def method(something):
                assert something == 'bar'
            method()

    def test_query_param_enum_lookup(self, app):
        from enum import Enum

        class FooEnum(Enum):
            Foobar = 'Foobar'

        with app.test_request_context('/?something=Foobar'):
            @param_converter(something=FooEnum)
            def method(something):
                assert something == FooEnum.Foobar
            method()

    def test_query_param_callable_conversion(self, app):
        with app.test_request_context('/?something=2'):
            @param_converter(something=lambda x: int(x) * 2)
            def method(something):
                assert something == 4
            method()

    def test_multiple_query_params(self, app):
        with app.test_request_context('/?foo=42&baz=boo'):
            @param_converter(foo=int, baz=str)
            def method(foo, baz):
                assert foo == 42
                assert baz == 'boo'
            method()

    def test_with_model_and_query_param(self, app, models):
        from backend.security.models import User
        with app.test_request_context('/?foo=42'):
            @param_converter(id=User, foo=int)
            def method(user, foo):
                assert user == models.user
                assert foo == 42
            method(id=models.user.id)


@pytest.mark.models('User(user1, user2, user3)')
def test_list_loader(models):
    from backend.security.models import User

    @list_loader(model=User)
    def method(users):
        assert users == User.all() == [models.user1, models.user2, models.user3]

    method()


@pytest.mark.models('User(user)')
def test_patch_loader(app, models, monkeypatch):
    from backend.security.serializers import UserSerializer

    with app.test_request_context():
        monkeypatch.setattr('flask.request.get_json', lambda: {
            'id': models.user.id,
            'firstName': 'foobar',
        })

        @patch_loader(serializer=UserSerializer())
        def method(user, errors):
            assert not errors, errors
            assert user.first_name == 'foobar'

        method(instance=models.user)

        monkeypatch.undo()


@pytest.mark.models('User(user)')
class TestPutLoader:
    def test_all_loadable_fields_required(self, app, models, monkeypatch):
        from backend.security.serializers import UserSerializer

        with app.test_request_context():
            monkeypatch.setattr('flask.request.get_json', lambda: {})

            @put_loader(serializer=UserSerializer())
            def method(user, errors):
                assert 'email' in errors
                assert 'username' in errors
                assert 'firstName' in errors
                assert 'lastName' in errors
                assert len(errors.keys()) == 4

            method(instance=models.user)

            monkeypatch.undo()

    def test_valid_submission(self, app, models, monkeypatch):
        from backend.security.serializers import UserSerializer

        with app.test_request_context():
            monkeypatch.setattr('flask.request.get_json', lambda: {
                'id': models.user.id,
                'email': models.user.email,
                'username': models.user.username,
                'firstName': 'foobar',
                'lastName': models.user.last_name})

            @put_loader(serializer=UserSerializer())
            def method(user, errors):
                assert not errors, errors
                assert user.first_name == 'foobar'

            method(instance=models.user)

            monkeypatch.undo()


class TestPostLoader:
    def test_loadable_fields_required(self, app, monkeypatch):
        from backend.security.serializers import UserSerializer

        serializer = UserSerializer()
        serializer.context['is_create'] = True

        with app.test_request_context():
            monkeypatch.setattr('flask.request.get_json', lambda: {})

            @post_loader(serializer=serializer)
            def method(user, errors):
                assert 'email' in errors
                assert 'username' in errors
                assert 'firstName' in errors
                assert 'lastName' in errors
                assert len(errors.keys()) == 4

            method()

            monkeypatch.undo()

    def test_valid_submission(self, app, monkeypatch):
        from backend.security.serializers import UserSerializer

        serializer = UserSerializer()
        serializer.context['is_create'] = True

        with app.test_request_context():
            monkeypatch.setattr('flask.request.get_json', lambda: {
                'email': 'the@email.com',
                'username': 'the_username',
                'firstName': 'first',
                'lastName': 'last'})

            @post_loader(serializer=serializer)
            def method(user, errors):
                assert not errors, errors
                assert user.email == 'the@email.com'
                assert user.username == 'the_username'
                assert user.first_name == 'first'
                assert user.last_name == 'last'

            method()

            monkeypatch.undo()
