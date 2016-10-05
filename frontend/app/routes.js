import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { renderMenuRoutes } from 'utils/menu';

import {
    About,
    Application,
    Home,
    Login,
    NotFound,
    Styles,
} from 'components';

/**
 * Declarative Route Configuration
 * https://github.com/ReactTraining/react-router/blob/master/docs/guides/RouteConfiguration.md#configuration-with-plain-routes
 */
const routes = {
    path: '/',
    component: Application,
    indexRoute: { component: Home },
    childRoutes: [
        { path: 'about', component: About },
        { path: 'styles', component: Styles },
        { path: 'login', component: Login },

        // default 404 if no match
        { path: '*', component: NotFound },
    ]
}

export default routes;
