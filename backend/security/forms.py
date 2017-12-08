from flask_login import current_user
from flask_security.forms import (
    Form,
    EqualTo,
    Length,
    PasswordField,
    PasswordFormMixin,
    password_required,
)
from flask_security.utils import get_message, verify_and_update_password

password_length = Length(min=8, max=128,
                         message='Password must be at least 8 characters long.')


class ChangePasswordFormMixin(object):
    newPassword = PasswordField(
        'New Password',
        validators=[password_required, password_length]
    )

    confirmNewPassword = PasswordField(
        'Confirm New Password',
        validators=[password_required,
                    EqualTo('newPassword', message='RETYPE_PASSWORD_MISMATCH')]
    )


class ChangePasswordForm(Form, PasswordFormMixin, ChangePasswordFormMixin):
    def validate(self):
        if not super().validate():
            return False

        if not verify_and_update_password(self.password.data, current_user):
            self.password.errors.append(get_message('INVALID_PASSWORD')[0])
            return False
        if self.password.data == self.newPassword.data:
            self.newPassword.errors.append(get_message('PASSWORD_IS_THE_SAME')[0])
            return False
        return True


class ResetPasswordForm(Form, ChangePasswordFormMixin):
    pass
