import { createContext } from 'react';
import { Router } from '../../types';

export const RouterContext = createContext<Router | null>(null);

export const RouterProvider = RouterContext.Provider;
