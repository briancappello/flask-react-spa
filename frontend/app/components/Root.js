import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import routes from 'routes';

export default class Root extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    // support hot reloading routes (kind of a hack...)
    // https://github.com/ReactTraining/react-router/issues/2704#issuecomment-211352123
    static defaultProps = {
        routerKey: 0,
    };

    render() {
        const { store, history, routerKey } = this.props;
        return (
            <Provider store={store}>
                <Router history={history} key={routerKey}>
                    {routes}
                </Router>
            </Provider>
        );
    }
};
