from flask_admin.form import BaseForm


class ReorderableForm(BaseForm):
    def __init__(self, formdata=None, obj=None, prefix=u'', **kwargs):
        super(ReorderableForm, self).__init__(formdata=formdata,
                                              obj=obj,
                                              prefix=prefix,
                                              **kwargs)
        if hasattr(self, 'field_order'):
            for field_name in self.field_order:
                self._fields.move_to_end(field_name)
