import { getNavigationMode, isRouteEvent } from "@t8/router";
import { type MouseEvent, useCallback, useContext } from "react";
import { RouteContext } from "./RouteContext";
import type { AProps } from "./types/AProps";
import type { AreaProps } from "./types/AreaProps";

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
