import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { PageContent } from 'components/Content'
import { flashSuccess } from 'actions/flash'

class Home extends Component {
  componentWillMount() {
    if (window.location.search.indexOf('welcome') > 0) {
      this.props.flashSuccess('Welcome!')
    }
  }

  render() {
    return (
      <PageContent>
        <h1>Home!</h1>
      </PageContent>
    )
  }
}

export default connect(
  (state) => ({}),
  (dispatch) => bindActionCreators({ flashSuccess }, dispatch),
)(Home)
