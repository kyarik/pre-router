import React, { VFC } from 'react';
import { RouterProvider } from '../../context/RouterContext';
import { Router } from '../../types';
import { Routes } from '../Routes';

interface Props {
  router: Router;
}

export const PreRouter: VFC<Props> = ({ router }) => {
  return (
    <RouterProvider value={router}>
      <Routes />
    </RouterProvider>
  );
};
