import React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'

import { bindRoutineCreators } from 'actions'
import { fetchProtected } from 'actions/protected'
import { PageContent } from 'components'


class Protected extends React.Component {
  componentWillMount() {
    this.props.fetchProtected.maybeTrigger()
  }

  render() {
    return (
      <PageContent>
        <Helmet>
          <title>Protected</title>
        </Helmet>
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

export default connect(
  (state) => ({ ...state.protected }),
  (dispatch) => bindRoutineCreators({ fetchProtected }, dispatch),
)(Protected)
