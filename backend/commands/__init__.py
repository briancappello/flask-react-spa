from .celery import celery
from .clean import clean
from .db import fixtures, drop, reset
from .lint import lint
from .shell import shell
from .test import test
from .urls import url, urls
