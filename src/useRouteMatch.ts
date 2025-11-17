import { type LocationPattern, type MatchState, match } from "@t8/router";
import { useMemo } from "react";
import { useRoute } from "./useRoute.ts";

export function useRouteMatch<P extends LocationPattern>(locationPattern?: P) {
  let { route } = useRoute();

  return useMemo(
    () =>
      match(
        locationPattern === undefined ? route.href : locationPattern,
        route.href,
      ),
    [locationPattern, route.href],
  ) as MatchState<P>;
}
