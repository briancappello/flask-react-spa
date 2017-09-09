from backend.extensions import celery, mail


@celery.task(serializer='pickle')
def send_mail_async_task(msg):
    mail.send(msg)
