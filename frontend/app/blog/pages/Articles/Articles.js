import React from 'react'
import Helmet from 'react-helmet'

import { ArticlesLayout, LatestArticles } from 'blog/components'


export default () => (
  <ArticlesLayout>
    <Helmet>
      <title>Articles</title>
    </Helmet>
    <h1>Articles!</h1>
    <LatestArticles />
  </ArticlesLayout>
)
