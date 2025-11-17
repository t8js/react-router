import type { LinkNavigationProps } from "@t8/router";
import type { AnchorHTMLAttributes } from "react";
import type { EnhanceHref } from "./EnhanceHref.ts";

export type AProps = EnhanceHref<AnchorHTMLAttributes<HTMLAnchorElement>> &
  LinkNavigationProps;
