import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { injectReducer, injectSagas } from 'utils/async'

import { listArticles } from 'blog/actions'
import { selectArticlesList } from 'blog/reducers/articles'

import ArticlePreview from './ArticlePreview'


class LatestArticles extends React.Component {
  componentWillMount() {
    this.props.listArticles.maybeTrigger()
  }

  render() {
    const { articles } = this.props

    if (articles.length === 0) {
      return <p>No articles have been published yet.</p>
    }

    return (
      <div>
        {articles.map((article, i) =>
          <ArticlePreview article={article} key={i} />
        )}
      </div>
    )
  }
}

const withReducer = injectReducer(require('blog/reducers/articles'))

const withSaga = injectSagas(require('blog/sagas/articles'))

const withConnect = connect(
  (state) => ({ articles: selectArticlesList(state) }),
  (dispatch) => bindRoutineCreators({ listArticles }, dispatch),
)

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LatestArticles)
