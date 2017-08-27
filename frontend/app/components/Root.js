import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import routes from 'routes'

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  render() {
    const { store, history } = this.props
    return (
      <Provider store={store}>
        <Router routes={routes} history={history} />
      </Provider>
    )
  }
}
