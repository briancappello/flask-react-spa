from flask_admin.contrib.sqla import ModelView as BaseModelView
from flask_admin.consts import ICON_TYPE_GLYPH

from .security import AdminSecurityMixin


class ModelAdmin(AdminSecurityMixin, BaseModelView):
    can_view_details = True

    menu_icon_type = ICON_TYPE_GLYPH
    menu_icon_value = None

    create_template = 'admin/model/base_create.html'
    details_template = 'admin/model/base_details.html'
    edit_template = 'admin/model/base_edit.html'
    list_template = 'admin/model/base_list.html'

    column_exclude_list = ('created_at', 'updated_at')
    form_excluded_columns = ('created_at', 'updated_at')
