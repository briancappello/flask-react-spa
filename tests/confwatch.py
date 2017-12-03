"""
Configuration file for customized version of pytest-watch

Install it with:
$ pip install git+git://github.com/briancappello/pytest-watch.git@partial-run-for-modified-files

Run it with:
$ ptw

Or to customize the args passed to pytest, for example to fail on first error:
$ ptw --runner "py.test --maxfail=1"

PR against upstream: https://github.com/joeyespo/pytest-watch/pull/78
"""

import os
from watchdog.events import FileMovedEvent


# ignore temporary files created by PyCharm
def should_ignore_event(event):
    if not isinstance(event, FileMovedEvent):
        return False

    return event.src_path.endswith('___jb_tmp___') or \
           event.dest_path.endswith('___jb_old___')


def get_test_filepath_for_modified_filepath(modified_filepath):
    if modified_filepath.startswith('tests/'):
        return modified_filepath

    if os.sep not in modified_filepath:
        return os.sep.join(['tests', 'test_' + modified_filepath])

    _, filepath = modified_filepath.split(os.sep, maxsplit=1)
    if os.sep not in filepath:
        return os.sep.join(['tests', 'test_' + filepath])

    path, filename = filepath.rsplit(os.sep, maxsplit=1)
    return os.sep.join(['tests', path, 'test_' + filename])
