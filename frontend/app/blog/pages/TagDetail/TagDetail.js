import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { PageContent } from 'components'
import { injectReducer, injectSagas } from 'utils/async'

import { loadTagDetail } from 'blog/actions'
import { ArticlePreview, ArticlesLayout, SeriesPreview } from 'blog/components'
import { selectTagBySlug } from 'blog/reducers/tagDetail'


class TagDetail extends React.Component {
  componentWillMount() {
    const { loadTagDetail, slug } = this.props
    loadTagDetail.maybeTrigger({ slug })
  }

  componentWillReceiveProps(nextProps) {
    const { loadTagDetail, slug } = nextProps
    if (slug != this.props.slug) {
      loadTagDetail.maybeTrigger({slug})
    }
  }

  render() {
    const { isLoaded, tag } = this.props
    if (!isLoaded) {
      return null
    }

    const { name, articles, series } = tag

    const hasSeries = !!(series && series.length)
    const hasArticles = !!(articles && articles.length)

    return (
      <PageContent>
        <ArticlesLayout tag={tag}>
          <Helmet>
            <title>Tag: {name}</title>
          </Helmet>
          <h1>Tag: {name}</h1>

          {hasSeries && <h2>Article Series tagged {name}</h2>}
          {series.map((series, i) =>
            <SeriesPreview series={series} key={i} />
          )}

          {hasSeries && hasArticles && <hr />}

          {hasArticles && <h2>Articles tagged {name}</h2>}
          {tag.articles.map((article, i) =>
            <ArticlePreview article={article} key={i} />
          )}
        </ArticlesLayout>
      </PageContent>
    )
  }
}

const withReducer = injectReducer(require('blog/reducers/tagDetail'))
const withSagas = injectSagas(require('blog/sagas/tagDetail'))

const withConnect = connect(
  (state, props) => {
    const slug = props.match.params.slug
    const tag = selectTagBySlug(state, slug)
    return {
      slug,
      tag,
      isLoaded: !!tag,
    }
  },
  (dispatch) => bindRoutineCreators({ loadTagDetail }, dispatch),
)

export default compose(
  withReducer,
  withSagas,
  withConnect,
)(TagDetail)
