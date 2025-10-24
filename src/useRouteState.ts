import {
  type LocationValue,
  type MatchState,
  match,
  type NavigationMode,
  type URLData,
} from "@t8/router";
import { useCallback, useMemo } from "react";
import { useRoute } from "./useRoute";

type SetState<T extends LocationValue> = (
  update: URLData<T> | ((state: MatchState<T>) => URLData<T>),
) => void;

export function useRouteState<T extends LocationValue>(
  location?: T,
  navigationMode?: NavigationMode,
) {
  let { route } = useRoute();

  let getState = useCallback(
    (href?: string) => {
      let resolvedHref = href ?? route.href;

      return match(
        location === undefined ? resolvedHref : location,
        resolvedHref,
      ) as MatchState<T>;
    },
    [location, route],
  );

  let setState = useCallback<SetState<T>>(
    (update) => {
      let state = typeof update === "function" ? update(getState()) : update;

      route._navigate(route.compile(location, state), navigationMode);
    },
    [location, route, navigationMode, getState],
  );

  let state = useMemo(
    () => getState(route.href),
    [getState, route.href],
  ) as MatchState<T>;

  return [state, setState] as [typeof state, SetState<T>];
}
