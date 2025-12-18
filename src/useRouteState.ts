import {
  type LocationValue,
  type MatchState,
  match,
  type NavigationOptions,
  type URLData,
} from "@t8/router";
import { useCallback, useMemo } from "react";
import { useRoute } from "./useRoute.ts";

type SetState<T extends LocationValue> = (
  update: URLData<T> | ((state: MatchState<T>) => URLData<T>),
) => void;

/**
 * Reads and sets URL parameters in a way similar to React's `useState()`.
 * This hooks returns `[state, setState]`, where `state` contains path
 * placeholder parameters and query parameters, `{ params?, query? }`.
 *
 * Note that the path placeholders, `params`, are only available if the
 * `url` parameter is an output of a typed URL builder (like the one
 * produced with *url-shape*).
 */
export function useRouteState<T extends LocationValue>(
  url?: T,
  options?: Omit<NavigationOptions, "href">,
) {
  let { route } = useRoute();

  let getState = useCallback(
    (href?: string) => {
      let resolvedHref = href ?? route.href;

      return match(
        url === undefined ? resolvedHref : url,
        resolvedHref,
      ) as MatchState<T>;
    },
    [url, route],
  );

  let setState = useCallback<SetState<T>>(
    (update) => {
      let state = typeof update === "function" ? update(getState()) : update;

      route._navigate({
        ...options,
        href: route.compile(url, state),
      });
    },
    [url, route, options, getState],
  );

  let state = useMemo(
    () => getState(route.href),
    [getState, route.href],
  ) as MatchState<T>;

  return [state, setState] as [typeof state, SetState<T>];
}
