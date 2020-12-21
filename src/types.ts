import {
  BrowserHistory,
  HashHistory,
  Location,
  MemoryHistory,
  MemoryHistoryOptions,
} from 'history';
import { ComponentType, ErrorInfo, ReactNode } from 'react';

export interface Match {
  params: Record<string, string>;
}

export interface RouteComponentProps<
  TPreloadedData = any,
  TParams extends Record<string, string> = Record<string, string>
> {
  /**
   * The preloaded data returned by `preloadData`. If `preloadData` is not
   * specified for a route, then `preloadedData` is `undefined`.
   */
  preloadedData: TPreloadedData;

  /**
   * The values of the dynamic parameters in the `path`, if any.
   */
  params: TParams;

  /**
   * Any matching child routes that should be rendered inside the parent route.
   */
  children: ReactNode;
}

export type RouteComponent<
  TPreloadedData = any,
  TParams extends Record<string, string> = Record<string, string>
> = ComponentType<RouteComponentProps<TPreloadedData, TParams>>;

export type Route<
  TPreloadedData = any,
  TParams extends Record<string, string> = Record<string, string>
> = {
  /**
   * The path for which this route will match. Path parameters, even with
   * custom regular expressions, are supported.
   */
  path?: string;

  /**
   * The component to render for the route.
   */
  component: RouteComponent<TPreloadedData, TParams>;

  /**
   * Function used to preload data for the route whenever it matches. This
   * function is called with the route parameters and it should return the
   * preloaded data in the form of a resource that the route component can
   * attempt to read and if it's not ready yet, the component suspends.
   */
  preloadData?: (params: TParams) => TPreloadedData;

  /**
   * The fallback component that will be shown while the component or data for
   * the route are still loading.
   */
  fallback?: ComponentType;

  /**
   * Children routes of the current route.
   */
  routes?: Route[];
};

export interface MatchedRoute<
  TPreloadedData = any,
  TParams extends Record<string, string> = Record<string, string>
> {
  route: Route<TPreloadedData, TParams>;
  match: Match;
}

export type PreloadedRoute<
  TPreloadedData = any,
  TParams extends Record<string, string> = Record<string, string>
> = {
  component: RouteComponent<TPreloadedData, TParams>;
  preloadedData: TPreloadedData;
  fallback?: ComponentType;
  match: Match;
};

export interface RouterEntry {
  location: Location;
  preloadedRoutes: PreloadedRoute[];
}

export type UseTransition = () => [(callback: () => void) => void, boolean];

/**
 * Specifies what type of content to preload for a path even before the
 * navigation to that path occurs.
 */
export type PreloadContentOption = 'code' | 'code-and-data' | 'none';

export type RouterHistoryOption = 'browser' | 'hash' | 'memory' | ['memory', MemoryHistoryOptions];

export interface RouterOptions {
  /**
   * The default fallback component to use for any route that didn't specify a
   * custom `fallback`. The default fallback will be shown while the component
   * or data for the route are loading.
   */
  defaultFallback?: ComponentType;

  /**
   * The error fallback component to show when an error occurs for some route,
   * e.g., when the component or data for a route fails to load.
   */
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;

  /**
   * The type of history object to use for route navigation. The history object
   * is created with the [`history`
   * package](https://github.com/ReactTraining/history).
   */
  history?: RouterHistoryOption;

  /**
   * Callback that is called when an error occurs for some route, e.g., when
   * the component or data for a route fails to load. This callback can be used
   * to log the error information to an error reporting service.
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;

  /**
   * Content to preload for a link's path whenever the link is hovered.
   */
  preloadOnLinkHover?: PreloadContentOption;

  /**
   * Content to preload for a link's path whenever the link is pressed in
   * (mouse down on desktop).
   */
  preloadOnLinkPressIn?: PreloadContentOption;

  /**
   * The `useTransition` hook exported by React. When you pass the
   * `useTransition` hook, you opt into having a delay during route updates in
   * order to avoid showing undesirable loading states.
   */
  useTransition?: UseTransition;
}

export interface Router {
  /**
   * Disables the transition for the next route update. This is only applicable
   * when you opt into route transitions by passing the `useTransition` option.
   */
  disableNextRouteTransition: () => void;

  /**
   * Enables the transition for the next route update. This is only applicable
   * when you opt into route transitions by passing the `useTransition` option.
   */
  enableNextRouteTransition: () => void;

  /**
   * Returns the current router entry, which consists of the location object
   * and the preloaded routes for that location.
   */
  getCurrentRouterEntry: () => RouterEntry;

  /**
   * The history object created with the `history` package, which provides the
   * primitives for route navigation.
   */
  history: BrowserHistory | MemoryHistory | HashHistory;

  /**
   * Returns whether the transition for the next route is enabled. This is only
   * applicable when you opt into route transitions by passing the
   * `useTransition` option.
   */
  isNextRouteTransitionEnabled: () => boolean;

  /**
   * The options provided to `createRouter` populated with default values for
   * all options that were omitted.
   */
  options: Required<RouterOptions>;

  /**
   * Preloads the specified `content` for the given path before the navigation
   * to that path actually occurs. Note that if the specified `content` is
   * already loaded or is loading for the given `path`, then this function has
   * no effect.
   */
  preloadBeforeNavigation: (path: string, content: PreloadContentOption) => void;

  /**
   * Refreshes the current router entry by preloading again the components and
   * data for the current entry. Note that if the components already loaded or
   * are still loading, then preloading them again will have no effect.
   */
  refreshCurrentRouterEntry: () => void;

  /**
   * Removes the history listener that the router attached to the history
   * object when it was created.
   */
  removeHistoryListener: () => void;

  /**
   * Subscribes the given callback function to router entry changes. A cleanup
   * function is returned that will unsubscribe the callback when called.
   */
  subscribe: (subscriber: (routerEntry: RouterEntry) => void) => () => void;
}
