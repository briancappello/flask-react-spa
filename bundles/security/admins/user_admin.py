from wtforms import fields, validators
from wtforms.fields import html5

from flask_security.forms import EqualTo, unique_user_email
from flask_security_bundle.forms import password_length

from flask_admin_bundle import ModelAdmin, macro
from flask_admin_bundle.forms import ReorderableForm

from backend.utils import utcnow


class BaseUserForm(ReorderableForm):
    def populate_obj(self, user):
        super().populate_obj(user)
        if user.active and not user.confirmed_at:
            user.confirmed_at = utcnow()


class UserAdmin(ModelAdmin):
    model = 'User'

    name = 'Users'
    category_name = 'Security'
    menu_icon_value = 'glyphicon-user'

    column_list = ('username', 'email', 'first_name', 'last_name', 'active')
    column_searchable_list = ('username', 'email', 'first_name', 'last_name')
    column_filters = ('active',)

    column_details_list = ('username', 'email', 'first_name', 'last_name',
                           'active', 'confirmed_at', 'created_at', 'updated_at')
    column_editable_list = ('active',)

    column_formatters = {
        'confirmed_at': macro('column_formatters.datetime'),
        'email': macro('column_formatters.email'),
    }

    form_base_class = BaseUserForm

    form_columns = ('username', 'email', 'first_name', 'last_name', 'roles', 'active')
    form_excluded_columns = ('articles', 'password', 'user_roles')

    form_overrides = dict(email=html5.EmailField)
    form_args = dict(email={'validators': [validators.DataRequired(),
                                           validators.Email()]},
                     roles={'get_label': lambda role: role.name})

    def get_create_form(self):
        CreateForm = super().get_create_form()

        CreateForm.email = html5.EmailField(
            'Email',
            validators=[
                validators.DataRequired(),
                validators.Email(),
                unique_user_email,
            ],
        )
        CreateForm.password = fields.PasswordField(
            'Password',
            validators=[
                validators.DataRequired(),
                password_length,
            ],
        )
        CreateForm.confirm_password = fields.PasswordField(
            'Confirm Password',
            validators=[
                validators.DataRequired(),
                EqualTo('password', message='RETYPE_PASSWORD_MISMATCH'),
            ],
        )

        CreateForm.field_order = (
            'username', 'email', 'first_name', 'last_name',
            'password', 'confirm_password', 'roles', 'active')

        return CreateForm
