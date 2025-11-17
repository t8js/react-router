import type { NavigationCallback } from "@t8/router";
import { useNavigationEvent } from "./useNavigationEvent.ts";

export function useNavigationComplete(callback: NavigationCallback) {
  useNavigationEvent("navigationcomplete", callback);
}
