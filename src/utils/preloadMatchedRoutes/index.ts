import { MatchedRoute, PreloadedRoute } from '../../types';
import { preloadLazyComponent } from 'suspendable';

export const preloadMatchedRoutes = (matchedRoutes: MatchedRoute[]): PreloadedRoute[] =>
  matchedRoutes.map(({ route, match }) => {
    const { component, preloadData, fallback } = route;

    const preloadedData = preloadData && preloadData(match.params);

    preloadLazyComponent(component);

    return {
      component,
      preloadedData,
      fallback,
      match,
    };
  });
