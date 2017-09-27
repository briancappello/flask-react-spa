from flask import render_template
from flask_mail import Message

from backend.tasks import send_mail_async_task


def send_mail(subject, recipients, template, sender=None, **ctx):
    if not isinstance(recipients, (tuple, list)):
        recipients = [recipients]

    msg = Message(subject=subject, recipients=recipients, sender=sender)
    msg.html = render_template(template, **ctx)

    send_mail_async_task.delay(msg)
