import { Fragment } from 'react';
import { RouterOptions } from '../../types';
import { DefaultErrorFallback } from './DefaultErrorFallback';
import { defaultUseTransition } from './defaultUseTransition';
import { noop } from './noop';

export const getRouterOptionsWithDefaults = (options: RouterOptions): Required<RouterOptions> => {
  const {
    defaultFallback = Fragment,
    errorFallback = DefaultErrorFallback,
    history = 'browser',
    onError = noop,
    preloadOnLinkHover = 'code',
    preloadOnLinkPressIn = 'code-and-data',
    useTransition = defaultUseTransition,
  } = options;

  return {
    defaultFallback,
    errorFallback,
    history,
    onError,
    preloadOnLinkHover,
    preloadOnLinkPressIn,
    useTransition,
  };
};
