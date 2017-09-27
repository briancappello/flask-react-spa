from backend.extensions.marshmallow import ma


class ModelSerializer(ma.ModelSchema):
    def is_create(self):
        """Check if we're creating a new object. Note that this context flag
        must be set from the outside, ie when the class gets instantiated.
        """
        return self.context.get('is_create', False)

    def handle_error(self, error, data):
        """
        Customize the error messages for required/not-null validators with
        dynamically generated field names. This is definitely a little hacky
        (it mutates state, uses hardcoded strings), but unsure how better to do it
        """
        for field_name in error.field_names:
            for i, msg in enumerate(error.messages[field_name]):
                if msg == 'Missing data for required field.' or msg == 'Field may not be null.':
                    error.messages[field_name][i] = '%s is required.' % field_name.replace('_', ' ').title()
