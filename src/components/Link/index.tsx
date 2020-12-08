import React, { AnchorHTMLAttributes, FC, MouseEvent, useCallback } from 'react';
import { useRouter } from '../../hooks/useRouter';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
}

export const Link: FC<LinkProps> = ({
  to,
  target,
  onClick,
  onMouseEnter,
  onMouseDown,
  children,
  ...props
}) => {
  const { history, options, preloadBeforeNavigation } = useRouter();
  const targetBlank = target === '_blank';

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!targetBlank) {
        event.preventDefault();
        history.push(to);
      }

      if (onClick) {
        onClick(event);
      }
    },
    [history, onClick, targetBlank, to],
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!targetBlank) {
        preloadBeforeNavigation(to, options.preloadOnLinkHover);
      }

      if (onMouseEnter) {
        onMouseEnter(event);
      }
    },
    [onMouseEnter, options.preloadOnLinkHover, preloadBeforeNavigation, targetBlank, to],
  );

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!targetBlank) {
        preloadBeforeNavigation(to, options.preloadOnLinkPressIn);
      }

      if (onMouseDown) {
        onMouseDown(event);
      }
    },
    [onMouseDown, options.preloadOnLinkPressIn, preloadBeforeNavigation, targetBlank, to],
  );

  return (
    <a
      {...props}
      href={history.createHref(to)}
      target={target}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
    >
      {children}
    </a>
  );
};
