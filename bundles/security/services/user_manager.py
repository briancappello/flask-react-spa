from flask_unchained.bundles.security import UserManager as BaseUserManager


class UserManager(BaseUserManager):
    def create(self, username, email, password, first_name, last_name, **kwargs):
        return super().create(username=username, email=email, password=password,
                              first_name=first_name, last_name=last_name, **kwargs)
