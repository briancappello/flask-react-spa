import sqlalchemy
from flask_admin.form import BaseForm
from flask_admin.form.fields import Select2Field
from flask_admin.model.form import converts
from flask_admin.contrib.sqla.form import AdminModelConverter


class ReorderableForm(BaseForm):
    def __init__(self, formdata=None, obj=None, prefix=u'', **kwargs):
        super().__init__(formdata=formdata, obj=obj, prefix=prefix, **kwargs)
        if hasattr(self, 'field_order'):
            for field_name in self.field_order:
                self._fields.move_to_end(field_name)


class EnumField(Select2Field):
    def __init__(self, column, **kwargs):
        assert isinstance(column.type, sqlalchemy.sql.sqltypes.Enum)

        def coercer(value):
            # coerce incoming value to enum value
            if isinstance(value, column.type.enum_class):
                return value
            elif isinstance(value, str):
                return column.type.enum_class[value]
            else:
                raise ValueError('Invalid choice {enumclass} {value}'.format(
                    enumclass=column.type.enum_class,
                    value=value
                ))

        super(EnumField, self).__init__(
            choices=[(v, v) for v in column.type.enums],
            coerce=coercer,
            **kwargs
        )

    def pre_validate(self, form):
        for v, _ in self.choices:
            if self.data == self.coerce(v):
                break
        else:
            raise ValueError(self.gettext('Not a valid choice'))


class CustomAdminConverter(AdminModelConverter):
    @converts('sqlalchemy.sql.sqltypes.Enum')
    def convert_enum(self, field_args, **extra):
        return EnumField(column=extra['column'], **field_args)
