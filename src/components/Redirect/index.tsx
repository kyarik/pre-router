import { useEffect, VFC } from 'react';
import { useRouter } from '../../hooks/useRouter';

export interface RedirectProps {
  to: string;
  push?: boolean;
}

export const Redirect: VFC<RedirectProps> = ({ to, push = false }) => {
  const { history } = useRouter();

  useEffect(() => {
    const redirect = push ? history.push : history.replace;

    redirect(to);
  }, [history, push, to]);

  return null;
};
