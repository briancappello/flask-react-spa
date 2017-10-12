import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { PageContent } from 'components'

import { flashSuccess } from 'site/actions'
import { ArticlesLayout, LatestArticles } from 'blog/components'
import About from 'components/About'


class Home extends React.Component {
  componentWillMount() {
    if (window.location.search.indexOf('welcome') > 0) {
      this.props.flashSuccess('Welcome!')
    }
  }

  render() {
    return (
      <PageContent>
        <About />
        <ArticlesLayout>
          <h2>Latest Articles!</h2>
          <LatestArticles />
        </ArticlesLayout>
      </PageContent>
    )
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => bindActionCreators({ flashSuccess }, dispatch),
)(Home)
