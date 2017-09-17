import React from 'react'
import Helmet from 'react-helmet'

import { PageContent } from 'components/Content'


export default () => (
  <PageContent>
    <Helmet>
      <title>About</title>
    </Helmet>
    <h1>About!</h1>
  </PageContent>
)
