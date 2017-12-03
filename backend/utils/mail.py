from flask import current_app, render_template
from flask_mail import Message

from backend.tasks import send_mail_async_task


def send_mail(subject, recipients, template, sender=None, **ctx):
    if not isinstance(recipients, (tuple, list)):
        recipients = [recipients]

    msg = Message(subject=subject, recipients=recipients, sender=sender)
    msg.html = render_template(template, **ctx)

    if current_app and current_app.config.get('TESTING'):
        return send_mail_async_task.apply([msg])

    return send_mail_async_task.delay(msg)
