import flask
from celery import Celery


class FlaskCelery(Celery):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.override_task_class()

        if 'app' in kwargs:
            self.init_app(kwargs['app'])

    def override_task_class(self):
        BaseTask = self.Task
        _celery = self

        class ContextTask(BaseTask):
            abstract = True

            def __call__(self, *args, **kwargs):
                if flask.has_app_context():
                    return BaseTask.__call__(self, *args, **kwargs)
                else:
                    with _celery.app.app_context():
                        return BaseTask.__call__(self, *args, **kwargs)

        self.Task = ContextTask

    def init_app(self, app):
        self.app = app
        self.__autoset('broker_url', app.config.get('CELERY_BROKER_URL'))
        self.__autoset('result_backend', app.config.get('CELERY_RESULT_BACKEND'))
        self.config_from_object(app.config)
        self.autodiscover_tasks(lambda: ['backend'] + app.config.get('BUNDLES'))

    def __autoset(self, key, value):
        if value:
            self._preconf[key] = value
            self._preconf_set_by_auto.add(key)


celery = FlaskCelery('backend.app')
