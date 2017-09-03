from flask_login import current_user
from marshmallow import fields, validates, validates_schema, ValidationError

from backend.extensions.flask_marshmallow import ModelSerializer
from backend.auth.models import User, Role


class UserSerializer(ModelSerializer):
    email = fields.Email(required=True)
    roles = fields.Nested('RoleSerializer', only='name', many=True)

    class Meta:
        model = User
        exclude = ('confirmed_at', 'created_at', 'updated_at', 'user_roles')
        dump_only = ('active', 'roles')
        load_only = ('password',)

    @validates_schema
    def validate_unique(self, data):
        is_create = self.context.get('is_create', False)

        username = data.get('username', False)
        if username:
            existing = User.get_by(username=username)
            if existing and (is_create or current_user != existing):
                raise ValidationError('Sorry, that username is already taken.', ['username'])

        email = data.get('email', False)
        if email:
            existing = User.get_by(email=email)
            if existing and (is_create or current_user != existing):
                raise ValidationError('Sorry, that email is already taken.', ['email'])

    @validates('password')
    def validate_password(self, value):
        if not value or len(value) < 8:
            raise ValidationError('Password must be at least 8 characters long.')


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'description')
