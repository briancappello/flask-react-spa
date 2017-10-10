import React from 'react'
import Helmet from 'react-helmet'

import { PageContent } from 'components'
import { ArticlesLayout, LatestArticles } from 'blog/components'


export default () => (
  <PageContent>
    <ArticlesLayout>
      <Helmet>
        <title>Articles</title>
      </Helmet>
      <h1>Articles!</h1>
      <LatestArticles />
    </ArticlesLayout>
  </PageContent>
)
