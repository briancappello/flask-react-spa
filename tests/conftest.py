import pytest

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


@pytest.fixture(autouse=True)
def db():
    db_ext.create_all()
    yield db_ext
    db_ext.drop_all()


@pytest.fixture(scope='session')
def celery_config():
    return {'broker_url': 'redis://localhost:6379/1',
            'result_backend': 'redis://localhost:6379/1',
            'accept_content': ('json', 'pickle')}


@pytest.fixture()
def outbox():
    with mail.record_messages() as messages:
        yield messages
