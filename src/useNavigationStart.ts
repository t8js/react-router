import type { NavigationCallback } from "@t8/router";
import { useNavigationEvent } from "./useNavigationEvent.ts";

/**
 * Adds an event handler invoked whenever the route navigation
 * is started.
 */
export function useNavigationStart(callback: NavigationCallback) {
  useNavigationEvent("navigationstart", callback);
}
