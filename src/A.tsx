import type { AProps } from "./types/AProps.ts";
import { useLinkClick } from "./useLinkClick.ts";

export const A = (props: AProps) => {
  let handleClick = useLinkClick(props);

  return <a {...props} href={String(props.href)} onClick={handleClick}/>;
};
