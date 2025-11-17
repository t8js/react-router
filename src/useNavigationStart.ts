import type { NavigationCallback } from "@t8/router";
import { useNavigationEvent } from "./useNavigationEvent.ts";

export function useNavigationStart(callback: NavigationCallback) {
  useNavigationEvent("navigationstart", callback);
}
