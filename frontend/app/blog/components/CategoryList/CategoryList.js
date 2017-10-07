import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { bindRoutineCreators } from 'actions'
import { NavLink } from 'components'
import { ROUTES } from 'routes'
import { injectReducer, injectSagas } from 'utils/async'

import { listCategories } from 'blog/actions'
import { ALL } from 'blog/constants'
import { selectCategoriesList } from 'blog/reducers/categories'

import CategoryLink from '../CategoryLink'

import './category-list.scss'


class CategoryList extends React.Component {
  componentWillMount() {
    const { listCategories } = this.props
    listCategories.maybeTrigger()
  }

  render() {
    const { categories, current } = this.props
    return (
      <ul className="categories">
        <li key="all" className={classnames({ active: current === ALL })}>
          <span>
          {current == ALL
            ? 'All'
            : <NavLink to={ROUTES.Articles}>All</NavLink>
          }
          </span>
        </li>
        {categories.map((category, i) => {
          const active = current && category.slug == current.slug
          return (
            <li key={i} className={classnames({ active })}>
              <span>
                <CategoryLink category={category} active={active} />
              </span>
            </li>
          )
        })}
      </ul>
    )
  }
}

const withReducer = injectReducer(require('blog/reducers/categories'))

const withSagas = injectSagas(require('blog/sagas/categories'))

const withConnect = connect(
  (state) => ({ categories: selectCategoriesList(state) }),
  (dispatch) => bindRoutineCreators({ listCategories }, dispatch),
)

export default compose(
  withReducer,
  withSagas,
  withConnect,
)(CategoryList)
