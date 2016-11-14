/**
 * menuLabel() and renderMenu()
 */

import React from 'react';
import { Link } from 'components/Nav';
import { inArray } from 'utils';

function separateCamelCase(str, sep) {
    // str='CamelCaseString', sep=' ' ==> 'Camel Case String'
    // str='CamelCaseABC', sep='--' ==> 'Camel--Case--ABC'
    return str.replace(/([A-Z]+)/g, match => sep + match).slice(sep.length);
}
function getComponentName(component) {
    return component.name == 'Connect'
        ? component.WrappedComponent.name
        : component.name;
}
export function menuLabel(component) {
    return component.menuLabel
        ? component.menuLabel
        : separateCamelCase(getComponentName(component), ' ');
}

export function topLevelMenu(routes, excludePaths=['*']) {
    return routes.childRoutes
        .filter(route => !inArray(route.path, excludePaths))
        .map((route, i) => {
            return (
                <Link to={route.path} key={i}>
                    {menuLabel(route.component)}
                </Link>
            );
        });
}
