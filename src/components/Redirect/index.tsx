import { useEffect, VFC } from 'react';
import { useRouter } from '../../hooks/useRouter';

export interface RedirectProps {
  to: string;
  push?: boolean;
}

/**
 * Component that can be used to perform an internal redirect. It accepts a
 * `to` prop specifying the destination path. By default, the new destination
 * will override the current entry in the history stack. If you instead want
 * the new destination to be added to the stack rather than replacing the
 * current enty, you can pass a `push` prop with a value of `true`.
 */
export const Redirect: VFC<RedirectProps> = ({ to, push = false }) => {
  const { history } = useRouter();

  useEffect(() => {
    const redirect = push ? history.push : history.replace;

    redirect(to);
  }, [history, push, to]);

  return null;
};
