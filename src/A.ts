import { createElement } from "react";
import type { AProps } from "./types/AProps.ts";
import { useLinkClick } from "./useLinkClick.ts";

export const A = (props: AProps) => {
  let handleClick = useLinkClick(props);

  return createElement("a", { ...props, onClick: handleClick });
};
