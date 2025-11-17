import { createElement } from "react";
import type { AreaProps } from "./types/AreaProps.ts";
import { useLinkClick } from "./useLinkClick.ts";

export const Area = (props: AreaProps) => {
  let handleClick = useLinkClick(props);

  return createElement("area", { ...props, onClick: handleClick });
};
