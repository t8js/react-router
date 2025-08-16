import {isLocationObject, type LocationValue, type URLData} from '@t8/router';
import {QuasiURL} from 'quasiurl';

export function compileHref<T extends LocationValue>(
    location: T | undefined,
    data: URLData<T>,
): string {
    if (isLocationObject(location)) return location.compile(data ?? {});

    if (!data?.query) return location ?? '';

    let {origin, pathname, hash} = new QuasiURL(location ?? '');
    let searchParams = new URLSearchParams();

    for (let [key, value] of Object.entries(data.query)) {
        if (value !== null && value !== undefined)
            searchParams.append(
                key,
                typeof value === 'string' ? value : JSON.stringify(value),
            );
    }

    let search = searchParams.toString();

    return `${origin}${pathname}${search ? `?${search}` : ''}${hash}`;
}
