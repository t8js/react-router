import type {LinkNavigationProps} from '@t8/router';
import type {AreaHTMLAttributes} from 'react';
import type {EnhanceHref} from './EnhanceHref';

export type AreaProps = EnhanceHref<AreaHTMLAttributes<HTMLAreaElement>> &
    LinkNavigationProps;
