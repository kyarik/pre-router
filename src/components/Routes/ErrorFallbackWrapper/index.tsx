import React, { useCallback, useEffect, VFC } from 'react';
import { clearResourceErrors } from 'suspendable';
import { useRouter } from '../../../hooks/useRouter';

interface Props {
  error: Error;
  resetError: () => void;
}

/**
 * The error fallback wrapper is used to show errors whenever a change route
 * causes an error to be thrown, i.e., whenever a data preload fails or a route
 * component fails to load and so the error boundary gets hit. First of all,
 * this component subscribes to router entry changes, so that if the user tries
 * to go back/forth in history, we know that the router entry got updated, so
 * we call resetError, causing the error boundary to render the children routes
 * rather than the error fallback (we also clear resource errors so that when
 * going back to the errored route, it will retry loading errored components
 * rather than failing with the old error). Then, if the retry action gets
 * triggered instead, we clear resource errors and refresh the current router
 * entry, causing all data preloads and component loads for the current routes
 * to retry. Since the router entry got refreshed, we are notified because we
 * subscribed to the router entry changes, and we call resetError, causing the
 * error boundary to reset the error and try to render the children, which
 * represent the routes with the router entry refreshed. We also disable the
 * next route transition because if the router entry is updated with a
 * transition, we will try to re-render the routes from the previous router
 * entry while the transition is pending. But re-rending those routes means to
 * hit the error boundary again due to the same error (i.e., failed data
 * preload).
 */
export const ErrorFallbackWrapper: VFC<Props> = ({ error, resetError }) => {
  const { disableNextRouteTransition, options, refreshCurrentRouterEntry, subscribe } = useRouter();
  const { errorFallback: ErrorFallback } = options;

  const retry = useCallback(() => {
    clearResourceErrors();
    refreshCurrentRouterEntry();
  }, [refreshCurrentRouterEntry]);

  useEffect(() => {
    disableNextRouteTransition();

    return subscribe(() => {
      clearResourceErrors();
      resetError();
    });
  }, [disableNextRouteTransition, resetError, subscribe]);

  return <ErrorFallback error={error} retry={retry} />;
};
