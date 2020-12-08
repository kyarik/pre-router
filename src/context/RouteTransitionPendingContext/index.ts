import { createContext } from 'react';

export const RouteTransitionPendingContext = createContext<boolean>(false);

export const RouteTransitionPendingProvider = RouteTransitionPendingContext.Provider;
