import { MatchedRoute, Route } from '../../types';
import { matchPath } from '../matchPath';

export const matchRoutes = (routes: Route[], path: string): MatchedRoute[] => {
  for (const route of routes) {
    const match = matchPath(path, route);

    if (match) {
      const matchedRoutes: MatchedRoute[] = [
        {
          route,
          match,
        },
      ];

      if (route.routes) {
        const matchedChildRoutes = matchRoutes(route.routes, path);

        matchedRoutes.push(...matchedChildRoutes);
      }

      return matchedRoutes;
    }
  }

  return [];
};
