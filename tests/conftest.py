import factory
import pytest

from datetime import datetime, timezone
from flask_unchained.bundles.sqlalchemy.pytest import ModelFactory

# FIXME: seems this is needed so pytest-in-tox will resolve the correct fixture order
from flask_unchained.bundles.security.pytest import client, api_client

from bundles.security.models import User, Role, UserRole


class UserFactory(ModelFactory):
    class Meta:
        model = User

    username = 'user'
    email = 'user@example.com'
    password = 'password'
    first_name = 'first'
    last_name = 'last'
    active = True
    confirmed_at = datetime.now(timezone.utc)


class RoleFactory(ModelFactory):
    class Meta:
        model = Role

    name = 'ROLE_USER'


class UserRoleFactory(ModelFactory):
    class Meta:
        model = UserRole

    user = factory.SubFactory(UserFactory)
    role = factory.SubFactory(RoleFactory)


class UserWithRoleFactory(UserFactory):
    user_role = factory.RelatedFactory(UserRoleFactory, 'user')


class UserWithTwoRolesFactory(UserFactory):
    _user_role = factory.RelatedFactory(UserRoleFactory, 'user',
                                        role__name='ROLE_USER')
    user_role = factory.RelatedFactory(UserRoleFactory, 'user',
                                       role__name='ROLE_USER1')


@pytest.fixture()
def user(request):
    kwargs = getattr(request.keywords.get('user'), 'kwargs', {})
    return UserWithTwoRolesFactory(**kwargs)


@pytest.fixture()
def role(request):
    kwargs = getattr(request.keywords.get('role'), 'kwargs', {})
    return RoleFactory(**kwargs)


@pytest.fixture()
def admin(request):
    kwargs = getattr(request.keywords.get('admin'), 'kwargs', {})
    kwargs = dict(**kwargs, username='admin', email='admin@example.com',
                  _user_role__role__name='ROLE_ADMIN')
    kwargs.setdefault('user_role__role__name', 'ROLE_USER')
    return UserWithTwoRolesFactory(**kwargs)
