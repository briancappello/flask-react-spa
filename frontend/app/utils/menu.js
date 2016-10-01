import React from 'react';
import { Link } from 'components/Nav';
import { Route } from 'react-router';


function separateCamelCase(str, sep) {
    return str.replace(/([A-Z]+)/g, match => sep + match).slice(sep.length);
}
function getName(component) {
    return component.name == 'Connect'
        ? component.WrappedComponent.name
        : component.name;
}
function getLabel(component) {
    return component.menuLabel
        ? component.menuLabel
        : separateCamelCase(getName(component), ' ');
}
function getPath(component) {
    return component.relativeUrlPath
        ? component.relativeUrlPath
        : separateCamelCase(getName(component), '-').toLowerCase();
}


export function renderMenu(menu, maxDepth=1, __depth=0, __parent='') {
    if (__depth > maxDepth) return;

    let menuClass = 'menu';
    if (__depth > 0) {
        menuClass = 'sub-menu';
        if (__depth > 1) {
            menuClass += `-${__depth}`;
        }
    }

    return (
        <ul className={menuClass}>
        {menu.map((item, i) => {
            if (item.hideInMenu) return;

            let { component, children } = item;
            const path = `${__parent}/${getPath(component)}`;

            if (children) {
                children = children.filter(child => !child.hideInMenu)
            }
            return (
                <li key={i}>
                    <Link to={path}>{getLabel(component)}</Link>
                    {children ? renderMenu(children, maxDepth, __depth + 1, path) : ''}
                </li>
            );
        })}
        </ul>
    );
}

export function renderMenuRoutes(menu) {
    return menu.map((item, i) => {
        const { component, children } = item;
        if (children) {
            return (
                <Route path={getPath(component)} component={component} key={i}>
                    {renderMenuRoutes(children)}
                </Route>
            );
        } else {
            return <Route path={getPath(component)} component={component} key={i}/>;
        }
    });
}
