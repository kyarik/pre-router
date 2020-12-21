import { useContext } from 'react';
import { RouteTransitionPendingContext } from '../../context/RouteTransitionPendingContext';

/**
 * Returns a boolean indicating whether a route transition is pending. This is
 * only applicable when you opt into route transitions by passing the
 * `useTransition` option.
 */
export const useRouteTransitionPending = () => {
  const routeTransitionPending = useContext(RouteTransitionPendingContext);

  return routeTransitionPending;
};
