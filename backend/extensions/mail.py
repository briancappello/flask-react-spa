from flask_mail import Mail as BaseMail


class Mail(BaseMail):
    def init_app(self, app):
        self.state = super().init_app(app)


mail = Mail()
