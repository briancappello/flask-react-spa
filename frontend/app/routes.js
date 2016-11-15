import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { renderMenuRoutes } from 'utils/menu';
import requireAuthentication from 'utils/auth';

import {
    About,
    Application,
    Home,
    Login,
    NotFound,
    Styles,
    Protected,
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
        { path: 'about', label: 'About', component: About },
        { path: 'styles', label: 'Styles', component: Styles },
        { path: 'protected', label: 'Protected', component: requireAuthentication(Protected) },
        { path: 'login', component: Login },

        // default 404 if no match
        { path: '*', component: NotFound },
    ]
}

export default routes;
