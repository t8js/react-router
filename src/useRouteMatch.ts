import {useMemo} from 'react';
import {type LocationPattern, type MatchState, getMatchState} from '@t8/router';
import {useRoute} from './useRoute';

export function useRouteMatch<P extends LocationPattern>(locationPattern?: P) {
    let {route} = useRoute();

    return useMemo(
        () =>
            getMatchState(
                locationPattern === undefined ? route.href : locationPattern,
                route.href,
            ),
        [locationPattern, route.href],
    ) as MatchState<P>;
}
