import type { ContainerElement, Route } from "@t8/router";
import { type RefObject, useContext, useEffect } from "react";
import { RouteContext } from "./RouteContext.ts";

/**
 * Converts plain HTML links to SPA route links.
 *
 * @param containerRef - A React Ref pointing to a container element.
 * @param elements - An optional selector, or an HTML element, or a
 * collection thereof, specifying the links inside the container to
 * convert to SPA route links. Default: `"a, area"`.
 */
export function useRouteLinks(
  containerRef: RefObject<ContainerElement>,
  elements?: Parameters<Route["observe"]>[1],
): void {
  let route = useContext(RouteContext);

  useEffect(() => {
    return route.observe(() => containerRef.current, elements);
  }, [route, elements, containerRef]);
}
