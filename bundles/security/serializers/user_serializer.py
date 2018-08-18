import re

from flask_unchained.bundles.api import ma
from flask_unchained.bundles.security.serializers import (
    UserSerializer as BaseUserSerializer)

from ..models import User

NON_ALPHANUMERIC_RE = re.compile(r'[^\w]')


class UserSerializer(BaseUserSerializer):
    class Meta:
        model = User
        exclude = ('confirmed_at', 'created_at', 'updated_at', 'user_roles', 'articles')
        dump_only = ('active', 'roles')
        load_only = ('password',)

    @ma.validates('username')
    def validate_username(self, username):
        if re.search(NON_ALPHANUMERIC_RE, username):
            raise ma.ValidationError('Username should only contain letters, numbers '
                                     'and/or the underscore character.')

        existing = self.user_manager.get_by(username=username)
        if existing and (self.is_create() or existing != self.instance):
            raise ma.ValidationError('Sorry, that username is already taken.')
