import React from 'react'

import ArticleLink from './ArticleLink'
import CategoryTags from './CategoryTags'


export default ({ article, article: { preview, slug }, titleOverride }) => (
  <div className="article-preview">
    <h3 id={slug}>
      <ArticleLink article={article} titleOverride={titleOverride} />
    </h3>
    <CategoryTags {...article} />
    <p className="preview">
      <span dangerouslySetInnerHTML={{__html: preview}} />
      <ArticleLink article={article} style={{ paddingLeft: '5px' }}>
        &raquo; continue reading &raquo;
      </ArticleLink>
    </p>
  </div>
)
