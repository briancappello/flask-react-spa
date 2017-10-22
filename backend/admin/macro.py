def macro(name):
    """Replaces flask_admin.model.template.macro, adding support for using
    macros imported from another file

    For Example::

        class FooAdmin(ModelAdmin):
            column_formatters = {
                'col_name': macro('<macro_import_name_inside_template>.<macro_name>')
            }
    """
    def wrapper(view, context, model, column):
        if '.' in name:
            macro_import_name, macro_name = name.split('.')
            m = getattr(context.get(macro_import_name), macro_name, None)
        else:
            m = context.resolve(name)

        if not m:
            return m

        return m(model=model, column=column)

    return wrapper
