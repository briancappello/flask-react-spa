import React from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'

import getInjectors from './sagaInjectors'


/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {string} key A key of the saga
 * @param {function} sagas A fn returning sagas to be injected
 * @param {string} [mode] By default, constants.DAEMON
 *   - constants.RESTART_ON_REMOUNT - the saga will be started on component mount and cancelled with `task.cancel()` on component un-mount for improved performance.
 *   - constants.DAEMON — starts the saga on component mount and never cancels it or starts again.
 *   - constants.ONCE_TILL_UNMOUNT — behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
export default ({ key, sagas, mode }) => (WrappedComponent) => {
  class InjectSaga extends React.Component {
    static WrappedComponent = WrappedComponent
    static contextTypes = {
      store: PropTypes.object.isRequired,
    }
    static displayName = `withSaga(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`

    componentWillMount() {
      const { injectSaga } = this.injectors

      // create a root saga to inject
      const saga = function *() {
        yield sagas()
      }

      injectSaga(key, { saga, mode }, this.props)
    }

    componentWillUnmount() {
      const { ejectSaga } = this.injectors

      ejectSaga(key)
    }

    injectors = getInjectors(this.context.store)

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return hoistNonReactStatics(InjectSaga, WrappedComponent)
}
