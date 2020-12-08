import { Match, Route } from '../../types';
import { matchRoutes } from '.';

it('correctly matches routes', () => {
  const home = { path: '/' } as Route;
  const a = { path: '/a' } as Route;
  const user = { path: '/@:username([a-z]+)' } as Route;
  const post = { path: '/:postSlug' } as Route;
  const aB = { path: '/a/b' } as Route;
  const categoryPosts = { path: '/:categorySlug/:year/posts' } as Route;
  const catchAll = {} as Route;

  const root = {
    routes: [home, a, user, post, aB, categoryPosts, catchAll],
  } as Route;

  const routes = [root];
  const match: Match = { params: {} };

  expect(matchRoutes(routes, '/')).toEqual([
    {
      route: root,
      match,
    },
    {
      route: home,
      match,
    },
  ]);

  expect(matchRoutes(routes, '/a')).toEqual([
    {
      route: root,
      match,
    },
    {
      route: a,
      match,
    },
  ]);

  expect(matchRoutes(routes, '/a-post')).toEqual([
    {
      route: root,
      match,
    },
    {
      route: post,
      match: {
        params: {
          postSlug: 'a-post',
        },
      },
    },
  ]);

  expect(matchRoutes(routes, '/nutrition/2020/posts')).toEqual([
    {
      route: root,
      match,
    },
    {
      route: categoryPosts,
      match: {
        params: {
          categorySlug: 'nutrition',
          year: '2020',
        },
      },
    },
  ]);

  expect(matchRoutes(routes, '/@john')).toEqual([
    {
      route: root,
      match,
    },
    {
      route: user,
      match: {
        params: {
          username: 'john',
        },
      },
    },
  ]);

  expect(matchRoutes(routes, '/b/c')).toEqual([
    {
      route: root,
      match,
    },
    {
      route: catchAll,
      match,
    },
  ]);

  expect(matchRoutes([home], '/')).toEqual([
    {
      route: home,
      match,
    },
  ]);

  expect(matchRoutes([home], '/a')).toEqual([]);

  expect(matchRoutes([], '/')).toEqual([]);
});
