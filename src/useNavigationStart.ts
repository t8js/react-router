import type {NavigationCallback} from '@t8/router';
import {useNavigationEvent} from './useNavigationEvent';

export function useNavigationStart(callback: NavigationCallback) {
    useNavigationEvent('navigationstart', callback);
}
