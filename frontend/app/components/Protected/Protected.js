import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { PageContent } from 'components'

import { fetchProtectedIfNeeded } from 'actions/protected'

class Protected extends Component {
  componentWillMount() {
    this.props.fetchProtectedIfNeeded()
  }

  render() {
    return (
      <PageContent>
        {this.renderContent()}
      </PageContent>
    )
  }

  renderContent() {
    const { isLoaded, isLoading, data } = this.props

    if (isLoading || !isLoaded) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <h1>Protected!</h1>
        {data.key}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  ...state.protected,
})

export default connect(
  mapStateToProps,
  (dispatch) => bindActionCreators({ fetchProtectedIfNeeded }, dispatch),
)(Protected)
