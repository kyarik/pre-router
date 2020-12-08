import { invariant } from 'circumspect';
import { useContext } from 'react';
import { RouterContext } from '../../context/RouterContext';

export const useRouter = () => {
  const router = useContext(RouterContext);

  invariant(router, 'No RouterProvider that provides the router was found.');

  return router;
};
