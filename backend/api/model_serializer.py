from flask_sqlalchemy import camel_to_snake_case
from backend.extensions.marshmallow import ma


def to_camel_case(s):
    parts = s.split('_')
    return parts[0] + ''.join(x.title() for x in parts[1:])


class ModelSerializer(ma.ModelSchema):
    def is_create(self):
        """Check if we're creating a new object. Note that this context flag
        must be set from the outside, ie when the class gets instantiated.
        """
        return self.context.get('is_create', False)

    def handle_error(self, error, data):
        """Customize the error messages for required/not-null validators with
        dynamically generated field names. This is definitely a little hacky
        (it mutates state, uses hardcoded strings), but unsure how better to do it
        """
        for field_name in error.field_names:
            for i, msg in enumerate(error.messages[field_name]):
                if msg == 'Missing data for required field.' or msg == 'Field may not be null.':
                    field_label = camel_to_snake_case(field_name).replace('_', ' ').title()
                    error.messages[field_name][i] = '%s is required.' % field_label

    def _update_fields(self, obj=None, many=False):
        """Overridden to automatically convert snake-cased field names to
        camel-cased (when dumping) and to load camel-cased field names back
        to their snake-cased counterparts
        """
        fields = super(ModelSerializer, self)._update_fields(obj, many)
        new_fields = self.dict_class()
        for name, field in fields.items():
            if '_' in name and field.dump_to is None:
                camel_cased_name = to_camel_case(name)
                field.dump_to = camel_cased_name
                field.load_from = camel_cased_name
            new_fields[name] = field
        self.fields = new_fields
        return new_fields
