from flask_unchained.bundles.admin import ModelAdmin

from ..models import Role


class RoleAdmin(ModelAdmin):
    model = Role

    name = 'Roles'
    category_name = 'Security'
    menu_icon_value = 'glyphicon-check'

    column_searchable_list = ('name',)
    column_sortable_list = ('name',)

    form_columns = ('name',)
    form_excluded_columns = ('role_users', 'created_at', 'updated_at')

    column_details_list = ('name', 'created_at', 'updated_at')
