from flask import url_for


def test_check_auth_token(api_client, user):
    r = api_client.get(url_for('api.check_auth_token'),
                       headers={'Authentication-Token': user.get_auth_token()})
    assert r.status_code == 200
    assert 'user' in r.json
    assert r.json['user']['id'] == user.id
