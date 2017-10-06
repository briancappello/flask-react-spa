import React from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics'
import get from 'lodash/get'

import getInjectors from './sagaInjectors'


/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {Object} props
 * @param {string} props.key A key of the saga
 * @param {function} props.sagas A fn returning sagas to be injected
 * @param {string} [props.mode] By default, constants.DAEMON
 *   - constants.RESTART_ON_REMOUNT - the saga will be started on component mount and cancelled with `task.cancel()` on component un-mount for improved performance.
 *   - constants.DAEMON — starts the saga on component mount and never cancels it or starts again.
 *   - constants.ONCE_TILL_UNMOUNT — behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
export default (props) => (WrappedComponent) => {
  if (get(props, '__esModule', false)) {
    props = {
      key: props.KEY,
      sagas: props.default,
      mode: get(props, 'MODE', null),
    }
  }

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
        yield props.sagas()
      }

      injectSaga(props.key, { saga, mode: props.mode }, this.props)
    }

    componentWillUnmount() {
      const { ejectSaga } = this.injectors

      ejectSaga(props.key)
    }

    injectors = getInjectors(this.context.store)

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return hoistNonReactStatics(InjectSaga, WrappedComponent)
}
