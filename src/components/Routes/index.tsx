import React, { ReactElement, Suspense, useEffect, useState, VFC } from 'react';
import { RouteTransitionPendingProvider } from '../../context/RouteTransitionPendingContext';
import { useRouter } from '../../hooks/useRouter';
import { ErrorBoundary } from './ErrorBoundary';
import { PreloadedRouteRenderer } from './PreloadedRouteRenderer';

/**
 * Component that renders the preloaded routes in the current router entry.
 */
export const Routes: VFC = () => {
  const router = useRouter();
  const { defaultFallback, onError, useTransition } = router.options;
  const [routerEntry, setRouterEntry] = useState(router.getCurrentRouterEntry);
  const [startTransition, isPending] = useTransition();

  useEffect(() => {
    setRouterEntry(router.getCurrentRouterEntry);

    return router.subscribe(nextRouterEntry => {
      if (router.isNextRouteTransitionEnabled()) {
        startTransition(() => {
          setRouterEntry(nextRouterEntry);
        });
      } else {
        setRouterEntry(nextRouterEntry);
        router.enableNextRouteTransition();
      }
    });
  }, [router, startTransition]);

  return (
    <RouteTransitionPendingProvider value={isPending}>
      <ErrorBoundary onError={onError}>
        {routerEntry.preloadedRoutes.reduceRight<ReactElement | null>((acc, preloadedRoute) => {
          const Fallback = preloadedRoute.fallback || defaultFallback;

          return (
            <Suspense fallback={<Fallback />}>
              <PreloadedRouteRenderer preloadedRoute={preloadedRoute}>{acc}</PreloadedRouteRenderer>
            </Suspense>
          );
        }, null)}
      </ErrorBoundary>
    </RouteTransitionPendingProvider>
  );
};
