import { Route } from '../../types';
import { matchRoutes } from '../matchRoutes';
import { preloadMatchedRoutes } from '../preloadMatchedRoutes';

export const preloadRoutes = (routes: Route[], path: string) =>
  preloadMatchedRoutes(matchRoutes(routes, path));
