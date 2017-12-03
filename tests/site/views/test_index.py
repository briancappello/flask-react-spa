from flask import url_for


def test_get_index(client):
    r = client.get(url_for('site.index'))
    assert r.status_code == 200
