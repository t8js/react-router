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
  let [, setHref] = useState(route.href);

  useEffect(
    () => route.on("navigationcomplete", (href) => setHref(href)),
    [route],
  );

  return useMemo(
    () => ({
      route,
      at: route.at.bind(route),
    }),
    [route],
  );
}
