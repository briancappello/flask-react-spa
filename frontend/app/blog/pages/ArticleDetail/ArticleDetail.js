import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'

import Highlight from 'react-highlight/lib/optimized'
import 'highlight.js/styles/tomorrow-night-eighties.css'

import { bindRoutineCreators } from 'actions'
import { PageContent, PageHeader } from 'components'
import { HIGHLIGHT_LANGUAGES } from 'config'
import { injectReducer, injectSagas } from 'utils/async'

import { loadArticleDetail } from 'blog/actions'
import {
  ArticleByLine,
  ArticleTitle,
  CategoryTags,
  SeriesNotice,
} from 'blog/components'
import { selectArticleDetailBySlug } from 'blog/reducers/articleDetail'


class ArticleDetail extends React.Component {
  componentWillMount() {
    const { loadArticleDetail, slug } = this.props
    loadArticleDetail.maybeTrigger({ slug })
  }

  renderTitle({ series, title }) {
    if (!series) {
      return <h1>{title}</h1>
    }

    return [
      <h1 key="series-title">{series.title}</h1>,
      <h2 key="article-title">{`Part ${series.part}: ${title}`}</h2>
    ]
  }

  foobar = (e) => {
    this.e = e
  }

  render() {
    const { isLoaded, article } = this.props
    if (!isLoaded) {
      return null
    }

    const { headerImage, html, series, title } = article

    return [
      headerImage && <PageHeader image={headerImage} key="header" />,
      <PageContent key="content">
        <Helmet>
          <title>
            {series
              ? `${series.title} Part ${series.part}: ${title}`
              : title
            }
          </title>
        </Helmet>
        {this.renderTitle(article)}
        {series && <SeriesNotice series={series} />}
        <CategoryTags {...article} />
        <ArticleByLine article={article} />
        <Highlight innerHTML languages={HIGHLIGHT_LANGUAGES}>
          {html}
        </Highlight>
      </PageContent>
    ]
  }
}

const withReducer = injectReducer(require('blog/reducers/articleDetail'))
const withSagas = injectSagas(require('blog/sagas/articleDetail'))

const withConnect = connect(
  (state, props) => {
    const slug = props.match.params.slug
    const article = selectArticleDetailBySlug(state, slug)
    return {
      slug,
      article,
      isLoaded: !!article,
    }
  },
  (dispatch) => bindRoutineCreators({ loadArticleDetail }, dispatch),
)

export default compose(
  withReducer,
  withSagas,
  withConnect,
)(ArticleDetail)
