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
    const { isLoaded, isLoading, data } = this.props

    if (isLoading || !isLoaded) {
      return <div>Loading...</div>
    }

    return (
      <PageContent>
        <h1>Protected!</h1>
        {data.key}
      </PageContent>
    )
  }
}

const mapStateToProps = state => ({
  ...state.protected,
})

export default connect(mapStateToProps, dispatch =>
  bindActionCreators({ fetchProtectedIfNeeded }, dispatch),
)(Protected)
