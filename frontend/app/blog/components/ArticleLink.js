import React from 'react'

import { NavLink } from 'components'
import { ROUTES } from 'routes'

import ArticleTitle from './ArticleTitle'


export default ({ article, children, titleOverride, ...props }) => (
  <NavLink to={ROUTES.ArticleDetail} params={article} {...props}>
    {children || <ArticleTitle article={article} titleOverride={titleOverride} />}
  </NavLink>
)
