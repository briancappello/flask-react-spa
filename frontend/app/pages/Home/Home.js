import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { PageContent } from 'components/Content'
import { flashSuccess } from 'actions/flash'
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
      </PageContent>
    )
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => bindActionCreators({ flashSuccess }, dispatch),
)(Home)
