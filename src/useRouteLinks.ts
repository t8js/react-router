import type { ContainerElement, Route } from "@t8/router";
import { type RefObject, useContext, useEffect } from "react";
import { RouteContext } from "./RouteContext.ts";

/**
 * Converts plain HTML links to route links, with history navigation
 * without full page reloads enabled.
 *
 * The links can be represented as a selector, or an HTML element,
 * or a collection of HTML elements.
 */
export function useRouteLinks(
  containerRef: RefObject<ContainerElement>,
  /**
   * A selector, or an HTML element, or a collection thereof.
   *
   * @defaultValue 'a, area'
   */
  elements?: Parameters<Route["observe"]>[1],
): void {
  let route = useContext(RouteContext);

  useEffect(() => {
    return route.observe(() => containerRef.current, elements);
  }, [route, elements, containerRef]);
}
