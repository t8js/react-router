import { useContext, useEffect, useMemo, useState } from "react";
import { RouteContext } from "./RouteContext";

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
