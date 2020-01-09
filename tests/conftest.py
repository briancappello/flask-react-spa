import os
import pytest

from collections import namedtuple
from flask import template_rendered
from flask_security.signals import (
    reset_password_instructions_sent,
    user_confirmed,
    user_registered,
)

from backend.app import _create_app
from backend.config import TestConfig
from backend.extensions import db as db_ext
from backend.extensions.mail import mail

from ._client import (
    ApiTestClient,
    ApiTestResponse,
    HtmlTestClient,
    HtmlTestResponse,
)
from ._model_factory import ModelFactory


@pytest.fixture(autouse=True, scope='session')
def app():
    app = _create_app(TestConfig)
    ctx = app.app_context()
    ctx.push()
    yield app
    ctx.pop()


@pytest.yield_fixture
def client(app):
    app.response_class = HtmlTestResponse
    app.test_client_class = HtmlTestClient
    with app.test_client() as client:
        yield client


@pytest.yield_fixture
def api_client(app):
    app.response_class = ApiTestResponse
    app.test_client_class = ApiTestClient
    with app.test_client() as client:
        yield client


@pytest.fixture(autouse=True, scope='session')
def db():
    db_ext.create_all()
    yield db_ext
    db_ext.drop_all()


@pytest.fixture(autouse=True)
def db_session(db):
    connection = db.engine.connect()
    transaction = connection.begin()

    session = db.create_scoped_session(options=dict(bind=connection, binds={}))
    db.session = session

    try:
        yield session
    finally:
        transaction.rollback()
        connection.close()
        session.remove()


@pytest.fixture(scope='session')
def celery_config():
    return {'broker_url': 'redis://localhost:6379/1',
            'result_backend': 'redis://localhost:6379/1',
            'accept_content': ('json', 'pickle')}


@pytest.fixture()
def templates(app):
    records = []
    RenderedTemplate = namedtuple('RenderedTemplate', 'template context')

    def record(sender, template, context, **extra):
        records.append(RenderedTemplate(template, context))
    template_rendered.connect(record, app)

    try:
        yield records
    finally:
        template_rendered.disconnect(record, app)


@pytest.fixture()
def outbox():
    with mail.record_messages() as messages:
        yield messages


@pytest.fixture()
def registrations(app):
    records = []

    def record(sender, *args, **kwargs):
        records.append(kwargs)
    user_registered.connect(record, app)

    try:
        yield records
    finally:
        user_registered.disconnect(record, app)


@pytest.fixture()
def confirmations(app):
    records = []

    def record(sender, *args, **kwargs):
        records.append(kwargs['user'])
    user_confirmed.connect(record, app)

    try:
        yield records
    finally:
        user_confirmed.disconnect(record, app)


@pytest.fixture()
def password_resets(app):
    records = []

    def record(sender, *args, **kwargs):
        records.append(kwargs)
    reset_password_instructions_sent.connect(record, app)

    try:
        yield records
    finally:
        reset_password_instructions_sent.disconnect(record, app)


@pytest.fixture()
def user(model_factory):
    yield model_factory.create('User', 'user')


@pytest.fixture()
def admin(model_factory):
    yield model_factory.create('User', 'admin')


@pytest.fixture(autouse=True)
def models(request, model_factory):
    mark = request.node.get_closest_marker('models')
    if mark:
        return model_factory.get_models(mark.args or mark.kwargs)


@pytest.fixture()
def model_factory(app, db_session):
    fixtures_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                'model_fixtures')
    yield ModelFactory(db_session, app.models, fixtures_dir)
