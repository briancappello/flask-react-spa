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
  ArticleLink,
  ArticleTitle,
  CategoryTags,
  SeriesNotice,
} from 'blog/components'
import { selectArticleDetailBySlug } from 'blog/reducers/articleDetail'

import './article-detail.scss'


class ArticleDetail extends React.Component {
  componentWillMount() {
    const { loadArticleDetail, slug } = this.props
    loadArticleDetail.maybeTrigger({ slug })
  }

  componentWillReceiveProps(nextProps) {
    const { loadArticleDetail, slug } = nextProps
    if (slug != this.props.slug) {
      loadArticleDetail.maybeTrigger({ slug })
    }
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

  renderPrevNext({ series, prev, next }) {
    if (!(prev || next)) {
      return null
    }

    let prev_title, next_title
    if (series) {
      prev_title = prev && `Part ${series.part - 1}: ${prev.title}`
      next_title = next && `Part ${series.part + 1}: ${next.title}`
    } else {
      prev_title = prev && prev.title
      next_title = next && next.title
    }

    return (
      <div className="row prev-next-links">
        {prev && <div className="prev">
          <ArticleLink article={prev}>&laquo;{` Previous - ${prev_title}`}</ArticleLink>
        </div>}
        {next && <div className="next">
          <ArticleLink article={next}>{`Next - ${next_title} `}&raquo;</ArticleLink>
        </div>}
      </div>
    )
  }

  render() {
    const { isLoaded, article } = this.props
    if (!isLoaded) {
      return null
    }

    const { headerImage, html, series, title } = article

    return [
      headerImage && <PageHeader image={headerImage} key="header" />,
      <PageContent className="article-detail" key="content">
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
        {this.renderPrevNext(article)}
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
