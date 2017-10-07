import React from 'react'

import { NavLink } from 'components'
import { ROUTES } from 'routes'


export default ({ active, category }) => active
  ? <strong>{category.name}</strong>
  : <NavLink to={ROUTES.CategoryDetail} params={category}>
      {category.name}
    </NavLink>
