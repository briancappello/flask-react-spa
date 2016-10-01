import thunk from 'redux-thunk';
import { applyMiddleware, compose, createStore } from 'redux';
import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { flashClearMiddleware } from 'middleware/flash';

import rootReducer from '../reducers';

export default function configureStore(initialState, history) {
    const logger = createLogger();

    const reduxRouterMiddleware = routerMiddleware(history);

    const middleware = applyMiddleware(
        thunk,
        logger,
        reduxRouterMiddleware,
        flashClearMiddleware,
    );

    const createStoreWithMiddleware = compose(
        middleware,
        window.devToolsExtension ? window.devToolsExtension() : f => f
    );

    const store = createStoreWithMiddleware(createStore)(rootReducer, initialState);

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
