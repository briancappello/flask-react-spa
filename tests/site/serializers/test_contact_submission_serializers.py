from backend.site.serializers import ContactSubmissionSerializer


def test_contact_submission_serializer():
    serializer = ContactSubmissionSerializer()

    # check it escapes html tags, and converts paragraphs to html
    data = {'message': '<h1>hello</h1>\nworld'}
    msg = serializer.message_to_html(data)['message']
    assert '<h1>' not in msg, 'it should escape html from user-submitted messages'
    assert msg.count('<p>') == 2, 'it should wrap paragraphs in <p> tags'
    assert msg.count('</p>') == 2, 'it should wrap paragraphs in <p> tags'

    # check required fields
    _, errors = serializer.load({'name': None,
                                 'email': None,
                                 'message': None})
    assert 'Name is required.' in errors['name']
    assert 'Email is required.' in errors['email']
    assert 'Message is required.' in errors['message']

    # check email must be valid
    _, errors = serializer.load({'email': 'invalid'})
    assert 'Not a valid email address.' in errors['email']
