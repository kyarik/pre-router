import { assertNever } from 'circumspect';
import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';
import { RouterHistoryOption } from '../../types';

export const createHistory = (routerHistoryOption: RouterHistoryOption) => {
  if (routerHistoryOption === 'browser') {
    return createBrowserHistory();
  }

  if (routerHistoryOption === 'memory') {
    return createMemoryHistory();
  }

  if (routerHistoryOption === 'hash') {
    return createHashHistory();
  }

  if (Array.isArray(routerHistoryOption)) {
    return createMemoryHistory(routerHistoryOption[1]);
  }

  return assertNever(routerHistoryOption);
};
