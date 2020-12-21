import React, { VFC } from 'react';
import { RouterProvider } from '../../context/RouterContext';
import { Router } from '../../types';
import { Routes } from '../Routes';

interface Props {
  router: Router;
}

/**
 * Component that is responsible for rendering the routes of your app. It
 * accepts a single `router` prop, which is the `Router` object that was
 * creating with `createRouter`.
 */
export const PreRouter: VFC<Props> = ({ router }) => {
  return (
    <RouterProvider value={router}>
      <Routes />
    </RouterProvider>
  );
};
