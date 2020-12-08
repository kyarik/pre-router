import { assertNever } from 'circumspect';
import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';
import { RouterHistory } from '../../types';

export const createHistory = (routerHistory: RouterHistory) => {
  if (routerHistory === 'browser') {
    return createBrowserHistory();
  }

  if (routerHistory === 'memory') {
    return createMemoryHistory();
  }

  if (routerHistory === 'hash') {
    return createHashHistory();
  }

  if (Array.isArray(routerHistory)) {
    return createMemoryHistory(routerHistory[1]);
  }

  return assertNever(routerHistory);
};
