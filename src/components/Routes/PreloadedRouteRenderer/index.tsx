import React, { FC, ReactNode } from 'react';
import { PreloadedRoute } from '../../../types';

interface Props {
  preloadedRoute: PreloadedRoute;
  children: ReactNode;
}

export const PreloadedRouteRenderer: FC<Props> = ({ preloadedRoute, children }) => {
  const { component: Component, preloadedData, match } = preloadedRoute;

  return (
    <Component preloadedData={preloadedData} params={match.params}>
      {children}
    </Component>
  );
};
