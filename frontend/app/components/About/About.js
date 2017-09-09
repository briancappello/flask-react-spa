import React, { Component } from 'react'
import Helmet from 'react-helmet'

import { PageContent } from 'components/Content'

export default class About extends Component {
  render() {
    return (
      <PageContent>
        <Helmet>
          <title>About</title>
        </Helmet>
        <h1>About!</h1>
      </PageContent>
    )
  }
}
