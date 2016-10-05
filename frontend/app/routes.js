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
 * Declarative definition of the "site map" (excluding the homepage)
 *
 * Components can optionally declare two static variables:
 *   menuLabel
 *   relativeUrlPath
 * If these are not specified, they will be inferred from the component's class name.
 * For example, a component with a class name of SuperAwesomeComponent is equivalent to:
 *   static menuLabel = "Super Awesome Component";
 *   static relativeUrlPath = "super-awesome-component";
 *
 * const menu = [
 *   { component: ComponentOne, children: [
 *     { component: ChildOne, children: [
 *       { component: GrandChildOne, hideInMenu: true }, // all further nested children are also hidden
 *     ]},
 *   ]},
 *   { component: ComponentTwo },
 *   { component: ComponentThree },
 * ];
 */
export const menu = [
    { component: About },
    { component: Styles },
    { component: Login, hideInMenu: true },
];

export default(
    <Route path="/" component={Application}>
        <IndexRoute component={Home} />
        {renderMenuRoutes(menu)}
        <Route path="*" component={NotFound}/>
    </Route>
);
