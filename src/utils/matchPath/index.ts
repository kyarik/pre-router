import { parsePath } from 'history';
import { Match, Route } from '../../types';
import { createPathRegex } from '../createPathRegex';

export const matchPath = (path: string, route: Route): Match | null => {
  if (!route.path) {
    return {
      params: {},
    };
  }

  const { pathname } = parsePath(path);

  if (!pathname) {
    return null;
  }

  const { regex, paramNames } = createPathRegex(route.path);

  const regexMatch = regex.exec(pathname);

  if (!regexMatch) {
    return null;
  }

  const params = regexMatch.slice(1).reduce<Record<string, string>>((params, paramValue, index) => {
    const paramName = paramNames[index];

    params[paramName] = paramValue;

    return params;
  }, {});

  return { params };
};
