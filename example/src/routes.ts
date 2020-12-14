import { Route } from 'pre-router';
import { lazyComponent } from 'suspendable';
import { preloadPost } from './PostPage/data';
import { preloadProfileData } from './ProfilePage/data';
import { preloadRootData } from './Root/data';

export const routes: Route[] = [
  {
    component: lazyComponent(() => import('./Root'), { autoRetry: true }),
    preloadData: () => preloadRootData(),
    routes: [
      {
        path: '/',
        component: lazyComponent(() => import('./HomePage'), { autoRetry: true }),
      },
      {
        path: '/profile',
        component: lazyComponent(() => import('./ProfilePage'), { autoRetry: true }),
        preloadData: () => preloadProfileData(),
      },
      {
        path: '/posts/:slug',
        component: lazyComponent(() => import('./PostPage'), { autoRetry: true }),
        preloadData: ({ slug }) => preloadPost(slug),
      },
      {
        component: lazyComponent(() => import('./Page404'), { autoRetry: true }),
      },
    ],
  },
];
