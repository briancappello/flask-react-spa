import React from 'react'

import { NavLink } from 'components'
import { ROUTES } from 'routes'


export default ({ children, series, series: { title } }) => (
  <NavLink to={ROUTES.SeriesDetail} params={series}>
    {children || title}
  </NavLink>
)
