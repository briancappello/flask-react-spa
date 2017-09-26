import React from 'react'
import Loadable from 'react-loadable'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showLoading, hideLoading } from 'react-redux-loading-bar'


/**
 * Provide an integration between react-loadable and react-redux-loading-bar
 *
 * The ProgressBar component is already rendered by components/App.js,
 * and it listens for the actions we're dispatching from this component's
 * lifecycle events
 */
class LoadableProgressComponent extends React.Component {
  componentWillMount() {
    this.props.showLoading()
  }

  componentWillUnmount() {
    this.props.hideLoading()
  }

  render() {
    return null
  }
}

export default ({ loader }) => Loadable({
  loader,
  delay: 0, // react-redux-loading-bar has its own time delay handling
  loading: connect(
    (state) => ({}),
    (dispatch) => bindActionCreators({ showLoading, hideLoading }, dispatch),
  )(LoadableProgressComponent),
})
