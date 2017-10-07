import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { PageContent, PageHeader } from 'components'
import { injectReducer, injectSagas } from 'utils/async'

import { loadSeriesDetail } from 'blog/actions'
import { ArticlePreview, CategoryTags } from 'blog/components'
import { selectSeriesDetailBySlug } from 'blog/reducers/seriesDetail'


class SeriesDetail extends React.Component {
  componentWillMount() {
    const { loadSeriesDetail, slug } = this.props
    loadSeriesDetail.maybeTrigger({ slug })
  }

  render() {
    const { isLoaded, series } = this.props
    if (!isLoaded) {
      return null
    }

    const { headerImage, title, summary, articles } = series
    return [
      headerImage && <PageHeader image={headerImage} key="header" />,
      <PageContent key="content">
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <h1>{title}</h1>
        <CategoryTags {...series} />
        <div dangerouslySetInnerHTML={{__html: summary}} />
        <h2>Articles</h2>
        {articles.map((article, i) => {
          const title = `Part ${article.series.part}: ${article.title}`
          return <ArticlePreview article={article} key={i} titleOverride={title} />
        })}
      </PageContent>
    ]
  }
}

const withReducer = injectReducer(require('blog/reducers/seriesDetail'))
const withSagas = injectSagas(require('blog/sagas/seriesDetail'))

const withConnect = connect(
  (state, props) => {
    const slug = props.match.params.slug
    const series = selectSeriesDetailBySlug(state, slug)
    return {
      slug,
      series,
      isLoaded: !!series,
    }
  },
  (dispatch) => bindRoutineCreators({ loadSeriesDetail }, dispatch),
)

export default compose(
  withReducer,
  withSagas,
  withConnect,
)(SeriesDetail)
