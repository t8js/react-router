import { Route } from "@t8/router";
import { type ReactNode, useEffect, useMemo } from "react";
import { RouteContext } from "./RouteContext.ts";

export type RouterProps = {
  href?: string | Route | undefined;
  children?: ReactNode;
};

/**
 * A component providing a URL value to the nested components.
 */
export const Router = ({ href, children }: RouterProps) => {
  let route = useMemo(() => {
    if (href instanceof Route) return href;
    else if (href === undefined || typeof href === "string")
      return new Route(href);
    else throw new Error("Router's 'href' of unsupported type");
  }, [href]);

  useEffect(() => () => route.stop(), [route]);

  return (
    <RouteContext.Provider value={route}>{children}</RouteContext.Provider>
  );
};
