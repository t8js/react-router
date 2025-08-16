import type {NavigationCallback, NavigationEvent} from '@t8/router';
import {useContext, useEffect} from 'react';
import {RouteContext} from './RouteContext';

export function useNavigationEvent(
    event: NavigationEvent,
    callback: NavigationCallback,
) {
    let route = useContext(RouteContext);

    useEffect(() => route.on(event, callback), [route, event, callback]);
}
