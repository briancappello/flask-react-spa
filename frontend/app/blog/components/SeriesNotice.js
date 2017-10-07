import React from 'react'

import SeriesLink from './SeriesLink'


export default ({ series, series: { part, title } }) => (
  <p>
    <em>This article is part #{part} in the series</em> "{title}."
    <em> <SeriesLink series={series}>Click here to view the table of contents.</SeriesLink></em>
  </p>
)
