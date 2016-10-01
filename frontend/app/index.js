import 'babel-polyfill';

import { AppContainer as HotReloadContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import { initialState } from 'reducers';
import configureStore from 'store';
import Root from 'components/Root';

import { validateToken } from 'utils/auth';
import { authLoginUserSuccess, authLogout } from 'actions/auth';
import { flashInfo } from 'actions/flash';


const targetEl = document.getElementById('app');

const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);

const token = sessionStorage.getItem('token');
if (validateToken(token)) {
    store.dispatch(authLoginUserSuccess(token));
    store.dispatch(flashInfo('Welcome back!'));
} else if (token) {
    store.dispatch(authLogout());
}

function rootNode(Root, routerKey=0) {
    return (
        <HotReloadContainer>
            <Root store={store} history={history} routerKey={routerKey}/>
        </HotReloadContainer>
    );
}

ReactDOM.render(rootNode(Root), targetEl);

if (module.hot) {
    let hotReloadRoutes = 0;
    module.hot.accept('./components/Root', () => {
        hotReloadRoutes++;
        const NextRoot = require('./components/Root').default;
        ReactDOM.render(rootNode(NextRoot, hotReloadRoutes), targetEl);
    });
}
