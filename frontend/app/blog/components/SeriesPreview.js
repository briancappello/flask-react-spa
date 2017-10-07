import React from 'react'

import ArticleLink from './ArticleLink'
import CategoryTags from './CategoryTags'
import SeriesLink from './SeriesLink'


export default ({ series, series: { slug, title, summary, articles } }) => (
  <div className="series-preview">
    <h3 id={slug}>
      <SeriesLink series={series} />
    </h3>
    <CategoryTags {...series} />
    <p className="summary" dangerouslySetInnerHTML={{__html: summary}} />
    <h4>Articles in this series:</h4>
    <ul>
      {articles.map((article, i) => (
        <li key={i}>
          <ArticleLink article={article}>
            {`Part ${article.part}: ${article.title}`}
          </ArticleLink>
        </li>
      ))}
    </ul>
  </div>
)
