from flask_mail import Message

from backend.tasks import send_mail_async_task


class TestTasks:
    def test_send_mail_task(self, outbox):
        msg = Message(subject='hello world',
                      recipients=['foobar@example.com'],
                      sender='noreply@example.com',
                      html='<h1>hi</h1>')

        send_mail_async_task.apply([msg])
        assert len(outbox) == 1
        assert outbox[0].subject == 'hello world'
        assert outbox[0].body == 'hi', 'expected plaintext message to be generated from html'
