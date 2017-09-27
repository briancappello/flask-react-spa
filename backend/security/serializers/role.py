from backend.api import ModelSerializer

from ..models import Role


class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = ('id', 'name', 'description')
