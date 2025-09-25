import { Route } from "@t8/router";
import { createElement, type ReactNode, useEffect, useMemo } from "react";
import { RouteContext } from "./RouteContext";

export type RouterProps = {
  location?: string | Route | undefined;
  children?: ReactNode;
};

export const Router = ({ location, children }: RouterProps) => {
  let route = useMemo(() => {
    if (location instanceof Route) return location;
    else if (location === undefined || typeof location === "string")
      return new Route(location);
    else throw new Error("Router location of unsupported type");
  }, [location]);

  useEffect(() => () => route.disconnect(), [route]);

  return createElement(RouteContext.Provider, { value: route }, children);
};
