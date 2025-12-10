import type { AreaProps } from "./types/AreaProps.ts";
import { useLinkClick } from "./useLinkClick.ts";

export const Area = ({ alt, ...props }: AreaProps) => {
  let handleClick = useLinkClick(props);

  return (
    <area
      {...props}
      href={String(props.href)}
      onClick={handleClick}
      alt={alt}
    />
  );
};
