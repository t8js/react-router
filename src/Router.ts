import {Route} from '@t8/router';
import {createElement, type ReactNode, useEffect} from 'react';
import {RouteContext} from './RouteContext';

export type RouterProps = {
    location?: string | Route | undefined;
    children?: ReactNode;
};

export const Router = ({location, children}: RouterProps) => {
    let route: Route;

    if (location instanceof Route) route = location;
    else if (location === undefined || typeof location === 'string')
        route = new Route(location);
    else throw new Error('Router location of unsupported type');

    useEffect(() => () => route.disconnect(), [route]);

    return createElement(RouteContext.Provider, {value: route}, children);
};
