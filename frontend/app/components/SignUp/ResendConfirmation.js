import React from 'react'

import { PageContent } from 'components/Content'

export default () => (
  <PageContent>
    <h1>Oops, that confirmation token has expired.</h1>
    <h5>A new one has been sent to your email address.</h5>
    <p>Please check your mail and try again.</p>
  </PageContent>
)

/**
 * FIXME: technically the user can also end up here if their token was invalid.
 * In that case, flask_security's confirm_email method will _NOT_ have sent a
 * token to the user's email address on file. To address that, you could
 * implement the send_confirmation view which accepts an email address.
 *
 * Most likely invalid tokens will only happen if the app's SECRET_KEY changed,
 * or the user is submitting garbage to the endpoint. So kind of unlikely.
 */
