import { getNavigationMode, getScrollMode, isRouteEvent } from "@t8/router";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useContext,
} from "react";
import { RouteContext } from "./RouteContext.ts";
import type { AProps } from "./types/AProps.ts";
import type { AreaProps } from "./types/AreaProps.ts";

export type UseLinkClickParams = AProps | AreaProps;

export function useLinkClick(props: UseLinkClickParams) {
  let { href, target, onClick } = props;
  let route = useContext(RouteContext);

  let navigationMode = getNavigationMode(props);
  let scrollMode = getScrollMode(props);

  return useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement & HTMLAreaElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented && isRouteEvent(event, { href, target })) {
        event.preventDefault();

        if (scrollMode !== "off") window.scrollTo(0, 0);

        route._navigate(href, navigationMode);
      }
    },
    [route, href, target, onClick, navigationMode, scrollMode],
  );
}
