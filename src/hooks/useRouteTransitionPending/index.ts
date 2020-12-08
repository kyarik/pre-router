import { useContext } from 'react';
import { RouteTransitionPendingContext } from '../../context/RouteTransitionPendingContext';

export const useRouteTransitionPending = () => {
  const routeTransitionPending = useContext(RouteTransitionPendingContext);

  return routeTransitionPending;
};
