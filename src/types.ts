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
  preloadedData: TPreloadedData;
  params: TParams;
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
  path?: string;
  component: RouteComponent<TPreloadedData, TParams>;
  preloadData?: (params: TParams) => TPreloadedData;
  fallback?: ComponentType;
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

export type PreloadContent = 'code' | 'code-and-data' | 'none';

export type RouterHistory = 'browser' | 'hash' | 'memory' | ['memory', MemoryHistoryOptions];

export interface RouterOptions {
  defaultFallback?: ComponentType;
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
  history?: RouterHistory;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  preloadOnLinkHover?: PreloadContent;
  preloadOnLinkPressIn?: PreloadContent;
  useTransition?: UseTransition;
}

export interface Router {
  disableNextRouteTransition: () => void;
  enableNextRouteTransition: () => void;
  getCurrentRouterEntry: () => RouterEntry;
  history: BrowserHistory | MemoryHistory | HashHistory;
  isNextRouteTransitionEnabled: () => boolean;
  options: Required<RouterOptions>;
  preloadBeforeNavigation: (path: string, content: PreloadContent) => void;
  refreshCurrentRouterEntry: () => void;
  removeHistoryListener: () => void;
  subscribe: (subscriber: (routerEntry: RouterEntry) => void) => () => void;
}
