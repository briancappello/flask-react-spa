from flask_security import SQLAlchemyUserDatastore as BaseSQLAlchemyUserDatastore


class SQLAlchemyUserDatastore(BaseSQLAlchemyUserDatastore):
    """Overridden because our User model can handle its own concerns without
    using this datastore. However, Flask-Security uses the datastore to
    manage users, and therefore we need to provide backwards compatibility to
    it. The primary concern is that we don't want to double-hash passwords.
    """
    def create_user(self, hash_password=False, **kwargs):
        super().create_user(**kwargs, hash_password=hash_password)

    def _prepare_create_user_args(self, **kwargs):
        """Overridden to not set default kwargs.

        The User class defines its own defaults.
        """
        # load roles by name if necessary
        roles = kwargs.get('roles', [])
        for i, role in enumerate(roles):
            if not isinstance(role, self.role_model):
                roles[i] = self.find_role(role)
        kwargs['roles'] = roles
        return kwargs
