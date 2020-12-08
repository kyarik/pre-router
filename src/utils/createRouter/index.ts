import { assertNever } from 'circumspect';
import { parsePath } from 'history';
import { preloadLazyComponent } from 'suspendable';
import {
  PreloadContent,
  PreloadedRoute,
  Route,
  Router,
  RouterEntry,
  RouterOptions,
} from '../../types';
import { createHistory } from '../createHistory';
import { getRouterOptionsWithDefaults } from '../getRouterOptionsWithDefaults';
import { matchRoutes } from '../matchRoutes';
import { preloadRoutes } from '../preloadRoutes';

export const createRouter = (routes: Route[], options: RouterOptions = {}): Router => {
  const optionsWithDefaults = getRouterOptionsWithDefaults(options);
  const history = createHistory(optionsWithDefaults.history);
  const preloadedRoutesBeforeNavigation = new Map<string, PreloadedRoute[]>();
  const subscribers = new Set<(routerEntry: RouterEntry) => void>();
  let nextRouteTransitionEnabled = true;

  let currentRouterEntry: RouterEntry = {
    location: history.location,
    preloadedRoutes: preloadRoutes(routes, history.location.pathname),
  };

  const removeHistoryListener = history.listen(({ location }) => {
    if (location.pathname === currentRouterEntry.location.pathname) {
      return;
    }

    const preloadedRoutes = preloadedRoutesBeforeNavigation.get(location.pathname);

    if (preloadedRoutes) {
      currentRouterEntry = {
        location,
        preloadedRoutes,
      };

      preloadedRoutesBeforeNavigation.delete(location.pathname);
    } else {
      currentRouterEntry = {
        location,
        preloadedRoutes: preloadRoutes(routes, location.pathname),
      };
    }

    subscribers.forEach(subscriber => subscriber(currentRouterEntry));
  });

  const getCurrentRouterEntry = () => currentRouterEntry;

  const refreshCurrentRouterEntry = () => {
    const { location } = currentRouterEntry;

    currentRouterEntry = {
      location,
      preloadedRoutes: preloadRoutes(routes, location.pathname),
    };

    subscribers.forEach(subscriber => subscriber(currentRouterEntry));
  };

  const preloadComponentsBeforeNavigation = (pathname: string) => {
    const matchedRoutes = matchRoutes(routes, pathname);

    matchedRoutes.forEach(({ route }) => preloadLazyComponent(route.component));
  };

  const preloadRoutesBeforeNavigation = (pathname: string) => {
    // Avoid preloading multiple times. The first check is necessary so that if
    // we try to preload multiple times the same route before navigating to it,
    // we only prelaod it once (e.g., link is hovered many times). The second
    // check is necessary so that once we update the router entry and are in the
    // middle of a pending route transition, we don't try to preload the route
    // we are going to again (e.g., link is hovered or pressed during the
    // pending transition).
    if (preloadedRoutesBeforeNavigation.has(pathname) || pathname === history.location.pathname) {
      return;
    }

    const preloadedRoutes = preloadRoutes(routes, pathname);

    preloadedRoutesBeforeNavigation.set(pathname, preloadedRoutes);
  };

  const preloadBeforeNavigation = (path: string, content: PreloadContent) => {
    const { pathname } = parsePath(path);

    if (!pathname) {
      return;
    }

    switch (content) {
      case 'code':
        preloadComponentsBeforeNavigation(pathname);
        break;
      case 'code-and-data':
        preloadRoutesBeforeNavigation(pathname);
        break;
      case 'none':
        break;
      default:
        assertNever(content);
    }
  };

  const subscribe = (subscriber: (routerEntry: RouterEntry) => void) => {
    subscribers.add(subscriber);

    return () => {
      subscribers.delete(subscriber);
    };
  };

  const isNextRouteTransitionEnabled = () => nextRouteTransitionEnabled;

  const enableNextRouteTransition = () => {
    nextRouteTransitionEnabled = true;
  };

  const disableNextRouteTransition = () => {
    nextRouteTransitionEnabled = false;
  };

  return {
    disableNextRouteTransition,
    enableNextRouteTransition,
    getCurrentRouterEntry,
    history,
    isNextRouteTransitionEnabled,
    options: optionsWithDefaults,
    preloadBeforeNavigation,
    refreshCurrentRouterEntry,
    removeHistoryListener,
    subscribe,
  };
};
