import React from 'react'

import { LongDate } from 'components'


const ArticleDateLine = ({ article: { publishDate, lastUpdated } }) => {
  if (!lastUpdated) {
    return (
      <span>
        on <strong><LongDate value={publishDate} /></strong>.
      </span>
    )
  }

  return (
    <span>
      on <LongDate value={publishDate} />,
      and last updated on <strong><LongDate value={lastUpdated} /></strong>.
    </span>
  )
}

export default ({ article, article: { author: { firstName, lastName } } }) => (
  <p className="article-by-line">
    <em>
      Posted by <strong>{firstName} {lastName}</strong>
      {' '}
      <ArticleDateLine article={article} />
    </em>
  </p>
)
