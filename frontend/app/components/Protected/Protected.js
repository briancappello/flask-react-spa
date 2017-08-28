import React, { Component } from 'react'
import { connect } from 'react-redux'

import { bindRoutineCreators } from 'actions'
import { fetchProtected } from 'actions/protected'
import { PageContent } from 'components'


class Protected extends Component {
  componentWillMount() {
    this.props.fetchProtected.maybeTrigger()
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
  (dispatch) => bindRoutineCreators({ fetchProtected }, dispatch),
)(Protected)
