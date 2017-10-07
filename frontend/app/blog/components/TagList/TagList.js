import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { bindRoutineCreators } from 'actions'
import { NavLink } from 'components'
import { ROUTES } from 'routes'
import { injectReducer, injectSagas } from 'utils/async'

import { listTags } from 'blog/actions'
import { ALL } from 'blog/constants'
import { selectTagsList } from 'blog/reducers/tags'

import TagLink from '../TagLink'

import './tag-list.scss'


class TagList extends React.Component {
  componentWillMount() {
    const { listTags } = this.props
    listTags.maybeTrigger()
  }

  render() {
    const { current, tags } = this.props
    return (
      <ul className="tags">
        <li key="all" className={classnames({ active: current === ALL })}>
          <span>
          {current == ALL
            ? 'All'
            : <NavLink to={ROUTES.Articles}>All</NavLink>
          }
          </span>
        </li>
        {tags.map((tag, i) => {
          const active = current && tag.slug == current.slug
          return (
            <li key={i} className={classnames({ active })}>
              <span>
                <TagLink tag={tag} active={active} />
              </span>
            </li>
          )
        })}
      </ul>
    )
  }
}

const withReducer = injectReducer(require('blog/reducers/tags'))

const withSagas = injectSagas(require('blog/sagas/tags'))

const withConnect = connect(
  (state) => ({ tags: selectTagsList(state) }),
  (dispatch) => bindRoutineCreators({ listTags }, dispatch),
)

export default compose(
  withReducer,
  withSagas,
  withConnect,
)(TagList)
