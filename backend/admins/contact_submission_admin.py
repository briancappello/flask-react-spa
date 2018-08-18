from flask_unchained.bundles.admin import ModelAdmin, macro

from ..models import ContactSubmission


class ContactSubmissionAdmin(ModelAdmin):
    model = ContactSubmission

    name = 'Contact Submissions'
    category_name = 'Mail'
    menu_icon_value = 'glyphicon-envelope'

    can_create = False
    can_edit = False

    column_list = ('name', 'email', 'message', 'created_at')
    column_exclude_list = ('updated_at',)
    column_labels = {'created_at': 'Date'}
    column_default_sort = ('created_at', True)

    column_details_list = ('name', 'email', 'message', 'created_at')

    column_formatters = {
        'email': macro('column_formatters.email'),
        'message': macro('column_formatters.safe'),
    }
