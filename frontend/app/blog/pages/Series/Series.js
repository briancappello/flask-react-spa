import React from 'react'
import Helmet from 'react-helmet'

import { PageContent } from 'components'
import { ArticlesLayout, SeriesList } from 'blog/components'


export default () => (
  <PageContent>
    <ArticlesLayout>
      <Helmet>
        <title>Article Series</title>
      </Helmet>
      <h1>Article Series!</h1>
      <SeriesList />
    </ArticlesLayout>
  </PageContent>
)
