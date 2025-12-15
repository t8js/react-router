import type { NavigationCallback } from "@t8/router";
import { useNavigationEvent } from "./useNavigationEvent.ts";

/**
 * Adds an event handler invoked whenever the route navigation
 * is complete.
 */
export function useNavigationComplete(callback: NavigationCallback) {
  useNavigationEvent("navigationcomplete", callback);
}
