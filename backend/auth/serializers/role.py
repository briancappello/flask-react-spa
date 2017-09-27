from backend.extensions.flask_marshmallow import ModelSerializer
from backend.auth.models import Role


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'description')
