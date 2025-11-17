import { getNavigationMode, isRouteEvent } from "@t8/router";
import { type MouseEvent, useCallback, useContext } from "react";
import { RouteContext } from "./RouteContext.ts";
import type { AProps } from "./types/AProps.ts";
import type { AreaProps } from "./types/AreaProps.ts";

export type UseLinkClickParams = AProps | AreaProps;

export function useLinkClick(props: UseLinkClickParams) {
  let { href, target, onClick } = props;
  let route = useContext(RouteContext);
  let navigationMode = getNavigationMode(props);

  return useCallback(
    (event: MouseEvent<HTMLAnchorElement & HTMLAreaElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented && isRouteEvent(event, { href, target })) {
        event.preventDefault();
        route._navigate(href, navigationMode);
      }
    },
    [route, href, target, onClick, navigationMode],
  );
}
