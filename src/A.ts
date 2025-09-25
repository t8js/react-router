import { createElement } from "react";
import type { AProps } from "./types/AProps";
import { useLinkClick } from "./useLinkClick";

export const A = (props: AProps) => {
  let handleClick = useLinkClick(props);

  return createElement("a", { ...props, onClick: handleClick });
};
