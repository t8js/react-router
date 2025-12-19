import type { NavigationCallback, NavigationOptions } from "@t8/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { RouteContext } from "./RouteContext.ts";

export type RenderCallback =
  | ((render: () => void, options: NavigationOptions) => void)
  | ((render: () => void, options: NavigationOptions) => Promise<void>);

/**
 * Returns `{ route, at }`, where:
 * - `route` is an object exposing a `window.location`-like API
 * for SPA navigation;
 * - `at(route, x, y)` is route matching function for URL-based
 * rendering acting similarly to the ternary conditional opearator
 * `atRoute ? x : y`.
 */
export function useRoute(callback?: RenderCallback) {
  let route = useContext(RouteContext);
  let [, setRevision] = useState(-1);

  useEffect(() => {
    let render = () => {
      setRevision(Math.random());
    };

    let handleNavigationComplete: NavigationCallback = (options) => {
      if (callback) callback(render, options);
      else render();
    };

    return route.on("navigationcomplete", handleNavigationComplete, true);
  }, [route, callback]);

  return useMemo(
    () => ({
      /**
       * An object exposing a `window.location`-like API for SPA navigation.
       */
      route,
      /**
       * Checks whether `urlPattern` matches the current URL and returns either
       * based on `x` if there is a match, or based on `y` otherwise. (It
       * loosely resembles the ternary conditional operator
       * `matchesPattern ? x : y`.)
       *
       * If the current location matches `urlPattern`, `at(urlPattern, x, y)`
       * returns:
       * - `x`, if `x` is not a function;
       * - `x({ params })`, if `x` is a function, with `params` extracted from
       * the current URL.
       *
       * If the current location doesn't match `urlPattern`, `at(urlPattern, x, y)`
       * returns:
       * - `y`, if `y` is not a function;
       * - `y({ params })`, if `y` is a function, with `params` extracted from
       * the current URL.
       */
      at: route.at.bind(route),
    }),
    [route],
  );
}
