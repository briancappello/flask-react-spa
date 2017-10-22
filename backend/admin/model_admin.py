from flask_admin.contrib.sqla import ModelView as BaseModelView
from flask_admin.consts import ICON_TYPE_GLYPH

from .security import AdminSecurityMixin


class ModelAdmin(AdminSecurityMixin, BaseModelView):
    can_view_details = True

    menu_icon_type = ICON_TYPE_GLYPH
    menu_icon_value = None
