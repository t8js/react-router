import { type ReactNode, useId, useMemo } from "react";
import { Router } from "../../../index.ts";
import { InputRoute } from "./InputRoute.ts";
import "./Browser.css";

export type BrowserProps = {
  children?: ReactNode;
  initialLocation?: string;
  autoFocus?: boolean;
};

export const Browser = ({
  children,
  initialLocation = "/",
  autoFocus,
}: BrowserProps) => {
  let inputId = useId();

  let route = useMemo(
    () => new InputRoute(inputId, initialLocation),
    [inputId, initialLocation],
  );

  return (
    <div className="browser">
      <div className="navbar">
        <span>View:</span>
        <input
          id={inputId}
          defaultValue={initialLocation}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder="Enter location"
        />
      </div>
      <div className="content">
        <Router location={route}>{children}</Router>
      </div>
    </div>
  );
};
