import React from 'react'
import Helmet from 'react-helmet'

import { PageContent } from 'components/Content'


export default () => (
  <PageContent>
    <Helmet>
      <title>Please Confirm your Email Address</title>
    </Helmet>
    <h1>Thanks for signing up!</h1>
    <p>Please check your email to confirm your email address and login.</p>
  </PageContent>
)
