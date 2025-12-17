import {
  getNavigationMode,
  getScrollMode,
  isRouteEvent,
  scroll,
} from "@t8/router";
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

      let linkProps = { href, target };

      if (!event.defaultPrevented && isRouteEvent(event, linkProps)) {
        event.preventDefault();

        route._navigate(href, navigationMode).then(() => {
          if (scrollMode !== "off") scroll(linkProps);
        });
      }
    },
    [route, href, target, onClick, navigationMode, scrollMode],
  );
}
