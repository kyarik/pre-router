import React, { FC, useMemo } from 'react';
import { usePathname } from '../..//hooks/usePathname';
import { combineClassNames } from '../..//utils/combineClassNames';
import { Link, LinkProps } from '../Link';

export type NavLinkProps = LinkProps;

export const NavLink: FC<NavLinkProps> = ({ to, className, ...props }) => {
  const pathname = usePathname();

  const combinedClassNames = useMemo(() => {
    const toUrl = new URL(to, window.location.href);

    return combineClassNames(className, toUrl.pathname === pathname && 'active');
  }, [className, pathname, to]);

  return <Link {...props} to={to} className={combinedClassNames} />;
};
