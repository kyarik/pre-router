import { Route } from '../../types';
import { matchPath } from '.';

it('matches a simple path without parameters', () => {
  const path = '/example';

  expect(matchPath(path, { path } as Route)).toEqual({
    params: {},
  });
});

it('matches a path with a parameter', () => {
  const path = '/some';

  expect(matchPath(path, { path: '/:param' } as Route)).toEqual({
    params: {
      param: 'some',
    },
  });
});

it('matches a nested path without parameters', () => {
  const path = '/a/b/c';

  expect(matchPath(path, { path } as Route)).toEqual({
    params: {},
  });
});

it('matches a path with parameters', () => {
  const path = '/some/foo/bar';

  expect(matchPath(path, { path: '/some/:param1/:param2' } as Route)).toEqual({
    params: {
      param1: 'foo',
      param2: 'bar',
    },
  });
});

it('does not match a simple path without parameters', () => {
  const path = '/example';

  expect(matchPath(path, { path: '/another' } as Route)).toBe(null);
  expect(matchPath(path, { path: '/example/another' } as Route)).toBe(null);
});

it('does not match a nested path without parameters', () => {
  const path = '/a/b/c';

  expect(matchPath(path, { path: '/a/b' } as Route)).toBe(null);
  expect(matchPath(path, { path: '/a/b/d' } as Route)).toBe(null);
  expect(matchPath(path, { path: '/a/b/c/d' } as Route)).toBe(null);
});

it('correctly handles trailing slashes', () => {
  const path = '/example';

  expect(matchPath(path, { path: '/example/' } as Route)).toBe(null);
});

it('ignores search and hash in the given path', () => {
  const path = '/example?q=1#paragraph-1';

  expect(matchPath(path, { path: '/example' } as Route)).toEqual({
    params: {},
  });
});

it('matches a route with a missing path', () => {
  const path = '/example';

  expect(matchPath(path, {} as Route)).toEqual({
    params: {},
  });
});

it('handles params with dashes, underscores, etc.', () => {
  const path = '/some-fancy_name--15';

  expect(matchPath(path, { path: '/:fancyName' } as Route)).toEqual({
    params: {
      fancyName: 'some-fancy_name--15',
    },
  });
});

it('allows having params with a custom regex', () => {
  expect(matchPath('/@user1', { path: '/@:username([a-z0-9]+)' } as Route)).toEqual({
    params: {
      username: 'user1',
    },
  });

  expect(matchPath('/@useR1', { path: '/@:username([a-z0-9]+)' } as Route)).toBe(null);
});

it('allows having multiple params with custom regexes', () => {
  expect(
    matchPath('/nutrition/2020/posts', {
      path: '/:categorySlug([a-z]+)/:year(\\d+)/posts',
    } as Route),
  ).toEqual({
    params: {
      categorySlug: 'nutrition',
      year: '2020',
    },
  });

  expect(
    matchPath('/nutrition/y2020/posts', {
      path: '/:categorySlug([a-z]+)/:year(\\d+)/posts',
    } as Route),
  ).toBe(null);
});
