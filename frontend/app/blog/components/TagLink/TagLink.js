import React from 'react'

import { NavLink } from 'components'
import { ROUTES } from 'routes'


export default ({ active, tag }) => active
  ? <strong>{tag.name}</strong>
  : <NavLink to={ROUTES.TagDetail} params={tag}>
      {tag.name}
    </NavLink>
