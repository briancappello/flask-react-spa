from backend.extensions.flask_marshmallow import ModelSerializer
from backend.security.models import Role


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'description')
