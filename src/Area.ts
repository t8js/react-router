import { createElement } from "react";
import type { AreaProps } from "./types/AreaProps";
import { useLinkClick } from "./useLinkClick";

export const Area = (props: AreaProps) => {
  let handleClick = useLinkClick(props);

  return createElement("area", { ...props, onClick: handleClick });
};
