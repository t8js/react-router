import { useContext, useEffect, useMemo, useState } from "react";
import { RouteContext } from "./RouteContext.ts";

/**
 * Returns `{ route, at }`, where:
 * - `route` is an object exposing a `window.location`-like API
 * for SPA navigation;
 * - `at(route, x, y)` is route matching function for URL-based
 * rendering acting similarly to the ternary conditional opearator
 * `atRoute ? x : y`.
 */
export function useRoute() {
  let route = useContext(RouteContext);
  let [, setRevision] = useState(-1);

  useEffect(
    () =>
      route.on("navigationcomplete", () => setRevision(Math.random()), true),
    [route],
  );

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
