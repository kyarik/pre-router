import { useEffect, useState } from 'react';
import { useRouter } from '../../hooks/useRouter';

/**
 * Returns the current location's pathname.
 */
export const usePathname = () => {
  const { history } = useRouter();
  const [pathname, setPathname] = useState(history.location.pathname);

  useEffect(() => {
    setPathname(history.location.pathname);

    return history.listen(({ location }) => {
      setPathname(location.pathname);
    });
  }, [history]);

  return pathname;
};
