import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { PageContent } from 'components'
import { injectReducer, injectSagas } from 'utils/async'

import { loadCategoryDetail } from 'blog/actions'
import { ArticlesLayout, ArticlePreview, SeriesPreview } from 'blog/components'
import { selectCategoryBySlug } from 'blog/reducers/categoryDetail'


class CategoryDetail extends React.Component {
  componentWillMount() {
    const { loadCategoryDetail, slug } = this.props
    loadCategoryDetail.maybeTrigger({ slug })
  }

  componentWillReceiveProps(nextProps) {
    const { loadCategoryDetail, slug } = nextProps
    if (slug != this.props.slug) {
      loadCategoryDetail.maybeTrigger({ slug })
    }
  }

  render() {
    const { isLoaded, category } = this.props
    if (!isLoaded) {
      return null
    }

    const { name, articles, series } = category

    const hasSeries = !!(series && series.length)
    const hasArticles = !!(articles && articles.length)

    return (
      <PageContent>
        <ArticlesLayout category={category}>
          <Helmet>
            <title>Category: {name}</title>
          </Helmet>
          <h1>Category: {name}</h1>

          {hasSeries && <h2>Article Series on {name}</h2>}
          {series.map((series, i) =>
            <SeriesPreview series={series} key={i} />
          )}

          {hasSeries && hasArticles && <hr />}

          {hasArticles && <h2>Articles on {name}</h2>}
          {articles.map((article, i) =>
            <ArticlePreview article={article} key={i} />
          )}
        </ArticlesLayout>
      </PageContent>
    )
  }
}

const withReducer = injectReducer(require('blog/reducers/categoryDetail'))
const withSagas = injectSagas(require('blog/sagas/categoryDetail'))

const withConnect = connect(
  (state, props) => {
    const slug = props.match.params.slug
    const category = selectCategoryBySlug(state, slug)
    return {
      slug,
      category,
      isLoaded: !!category,
    }
  },
  (dispatch) => bindRoutineCreators({ loadCategoryDetail }, dispatch),
)

export default compose(
  withReducer,
  withSagas,
  withConnect,
)(CategoryDetail)
