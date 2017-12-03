from flask import url_for


def test_create_contact_submission(api_client, outbox, templates):
    r = api_client.post(url_for('api.contact_submissions_resource'),
                        data=dict(name='foobar',
                                  email='foobar@example.com',
                                  message='hello world'))
    assert r.status_code == 201
    assert r.json['id']
    assert r.json['name'] == 'foobar'
    assert len(outbox) == len(templates) == 1
    assert templates[0].template.name == 'email/contact_submission.html'


def test_contact_submission_validation(api_client):
    r = api_client.post(url_for('api.contact_submissions_resource'),
                        data=dict(name=None, email=None, message=None))
    assert r.status_code == 400
    assert 'name' in r.json['errors'], 'name should be required'
    assert 'email' in r.json['errors'], 'email should be required'
    assert 'message' in r.json['errors'], 'message should be required'
