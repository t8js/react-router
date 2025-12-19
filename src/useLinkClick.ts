import { getNavigationOptions, isRouteEvent } from "@t8/router";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useContext,
} from "react";
import { RouteContext } from "./RouteContext.ts";
import type { AProps } from "./types/AProps.ts";
import type { AreaProps } from "./types/AreaProps.ts";

export function useLinkClick({ onClick }: AProps | AreaProps) {
  let route = useContext(RouteContext);

  return useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement & HTMLAreaElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented && isRouteEvent(event)) {
        event.preventDefault();
        route._navigate(getNavigationOptions(event.currentTarget));
      }
    },
    [route, onClick],
  );
}
