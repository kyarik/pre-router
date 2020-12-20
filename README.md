# pre-router

`pre-router` is a router for React with code and data preloading at its core.

`pre-router` allows you to specify for each route the component to render and the data to preload. Then, the code and data for the matching routes start loading in parallel right after the path changes, so even before rendering begins. This means that implementing the ["Render-as-You-Fetch" pattern](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense) is very natural with `pre-router`.

Once we begin rendering the matching routes, if the code or data has not finished loading for a route, then it will suspend until code and data are loaded, showing a fallback in the meantime.

`pre-router` also gives you the ability to start loading code and data even before the user clicks on a link. If the user hovers over a link, there's a chance that they'll click it, so we could start loading the code for that route as soon as the user hovers. And if the user presses the mouse down on a link, there's a very good chance that they'll complete the click, so we could also start loading the data for the route as soon as the user presses in on the link.

## Installation

Using yarn:

```
yarn add pre-router suspendable
```

Using npm:

```
npm install pre-router suspendable
```

Note that you also need to install `suspendable` in order to use `lazyComponent` for route components. `lazyComponent` is similar to `React.lazy` but has a few important differences like being able to start loading the component even before rendering begins and clear any errors after a component fails to load. You can read more about the differences in the [`suspendable` README](https://github.com/kyarik/suspendable#lazycomponent).

## Usage

### Preloading data

First, for each route that requires some data, we need to specify a function for preloading that data, which returns the preloaded data in the form of a resource that the route component can read synchronously, suspending if it's not ready yet.

Here's a simple example using `lazyResource` from `suspendable`:

```ts
const preloadPost = (slug: string) => {
  const resource = lazyResource(() => fetchPostBySlug(slug));

  resource.load();

  return resource;
};
```

However, you can use whatever library you want to preload data, as long as it's compatible with React Suspense, i.e., it allows creating resources that make the component suspend if the resource is not ready yet.

If you want to use a fetching library that is not compatible with React Suspense, you can still make it compatible by using the utils provided by `suspendable`.

### Route components

For each route, we need to specify a component, which needs to be the `default` export. For example:

```tsx
const PostPage: RouteComponent<PreloadedPostData> = ({ preloadedData, params }) => {
  const post = preloadedData.read();

  if (!post) {
    return <h1>Post with slug '{params.slug}' not found.</h1>;
  }

  return <h1>{post.title}</h1>;
};

export default PostPage;
```

### Defining routes

Next, we define all our routes by specifying for each the path, the component to use, and the data to preload:

```ts
const routes: Route[] = [
  {
    path: '/',
    component: lazyComponent(() => import('./HomePage')),
  },
  {
    path: '/profile',
    component: lazyComponent(() => import('./ProfilePage')),
    preloadData: () => preloadProfileData(),
  },
  {
    path: '/posts/:slug',
    component: lazyComponent(() => import('./PostPage')),
    preloadData: ({ slug }) => preloadPost(slug),
  },
  {
    component: lazyComponent(() => import('./Page404')),
  },
];
```

Notice that for the last route (the 404 route), we didn't specify a `path` so that it always matches.

`pre-router` matches routes starting from the first one and as soon as it finds a match, it stops. So, if no route matches a path, we end up reaching the 404 route, which always matches since it has no `path` specified.

Even though all routes can be specified top-level, most apps have a container around the content that often consists of the header and the footer, which might even require some data (e.g., showing the signed in user in the header). In that case, we should have a `<Root>` component. For example:

```tsx
const Root: RouteComponent = ({ children }) => (
  <>
    <Header />
    <Body>{children}</Body>
    <Footer />
  </>
);
```

and define it as the top-level route that always matches (so, no `path` is specified) with all the other routes defined as child routes:

```ts
const routes: Route[] = [
  {
    component: lazyComponent(() => import('./Root')),
    preloadData: () => preloadRootData(), // optionally preload data needed in header/footer
    routes: [
      {
        path: '/',
        component: lazyComponent(() => import('./HomePage')),
      },
      // ...
    ],
  },
];
```

### Rendering routes

Finally, to render the routes, we create a router and pass it to the `<PreRouter>` component:

```tsx
const router = createRouter(routes);

const App = () => <PreRouter router={router} />;
```

## API

- [`createRouter`](#createrouter)
- [`RouterOptions`](#routeroptions)
- [`PreloadContent`](#preloadcontent)
- [`Router`](#router)
- [`<PreRouter>`](#prerouter)
- [`<Link>`](#link)
- [`<NavLink>`](#navlink)
- [`<Redirect>`](#redirect)

### `createRouter`

```ts
createRouter(routes: Route[], options?: RouterOptions): Router
```

**Parameters**

- `routes: Route[]` is an array with the definition of all routes. A `Route` object consists of the following properties:

  - `path?: string` The path for which this route will match. Path parameters, even with custom regular expressions, are supported. For example, `/profile`, `/posts/:slug`, and `/@:username([a-z]+)` are all valid paths. If no `path` is specified, then this route will always match. This can be used for the `404` route for example. When `pre-router` matches routes against a path, it stops at the first match on each level. So, if you have routes with overllaping paths, e.g., `/about` and `/:username`, place the route with the more specific path, i.e., `/about`, before the route the generic path, i.e., `/:username`.
  - `preloadData?: (params: Record<string, string>) => any` is the function used to preload data for the route whenever it matches. This function is called with the route parameters and it should return the preloaded data in the form of a resource that the route component can attempt to read and if it's not ready yet, the component suspends.
  - `component: RouteComponent` is the component to render for the route. The component that is specified should be wrapped in `lazyComponent` so that it is code-split and it will start loading only when the route matches, in parallel with the data. (Remember that the component needs to be the `default` export when using `lazyComponent`.) This component will be passed the following props:
    - `params` The values of the dynamic parameters in the `path`, if any. For example, if `path` is `/post/:slug`, then `params` could be `{ slug: 'an-interesting-post' }`.
    - `preloadedData` is the preloaded data returned by `preloadData`. If `preloadData` is not specified for a route, then `preloadedData` is `undefined`.
    - `children` Any matching child routes that should be rendered inside the parent route.
  - `fallback?: ComponentType` is the optional fallback component that will be shown while the component or data for the route are still loading.
  - `routes?: Route[]` any children routes of the current route.

* `options?: RouterOptions` are the [router options](#routeroptions).

**Return value**

- `Router` a [router object](#router) that should be passed as the `router` prop to the [`<PreRouter>`](#prerouter) component.

**Description**

`createRouter` is used to create a router by specifying the definition for all our app's routes. The main properties in the definition of each route are the path, the function to preload the data for the route, and the component to render for the route. The created `Router` object can then be passed to the `<PreRouter>` component.

**Example**

```ts
const router = createRouter([
  {
    path: '/',
    component: lazyComponent(() => import('./components/HomePage'), {
      autoRetry: true,
    }),
  },
  {
    path: '/posts/:slug',
    component: lazyComponent(() => import('./components/PostPage'), {
      autoRetry: true,
    }),
    preloadData: ({ slug }) => preloadPost(slug),
  },
  {
    component: lazyComponent(() => import('./components/Page404'), {
      autoRetry: true,
    }),
  },
]);
```

### `RouterOptions`

```ts
interface RouterOptions {
  defaultFallback?: ComponentType;
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
  history?: RouterHistory;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  preloadOnLinkHover?: PreloadContent;
  preloadOnLinkPressIn?: PreloadContent;
  useTransition?: UseTransition;
}
```

- `defaultFallback?: ComponentType` is the default fallback component to use for any route that didn't specify a custom `fallback`. The default fallback will be shown while the component or data for the route are loading.

- `errorFallback?: ComponentType<{ error: Error; retry: () => void }>` is the error fallback component to show when an error occurs for some route, e.g., when the component or data for a route fails to load. This component is given two props: `error` and `retry`. `error` is the `Error` object and `retry` is a callback to retry loading the failed route. Generally, you should include a _Retry_ button in the error fallback, and pass `retry` as its `onClick` prop.

- `history?: RouterHistory` (default: `'browser'`) specifies the type of history object to use for route navigation. The history object is created with the [`history` package](https://github.com/ReactTraining/history). `RouterHistory` can be one of the following:

  - `'browser'` creates a `BrowserHistory` that uses the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API). The current route's path will be the actual path in the URL. For example, if the domain is `https://example.com` and the route path is `/profile`, then the URL for the page will be `https://example.com/profile`.
  - `'hash'` creates a `HashHistory`. The current route's path will be in the hash portion of the URL. For example, if the domain is `https://example.com`, the path under which the page loads is `/`, and the route path is `/profile`, then the URL for the page will be `https://example.com/#/profile`.
  - `'memory'` creates a `MemoryHistory`. The current route's path will be stored in memory, so no URL changes will be happening as the user navigates from one route to another. Memory history should be used in non-browser environments, such as React Native.
  - `['memory', MemoryHistoryOptions]` creates a `MemoryHistory`, just like for the `'memory'` option, but also allows to specify `MemoryHistoryOptions`, which consists of the following properties:
    - `initialEntries?: InitialEntry[]` are the initial entries in the history stack, e.g., `['/', '/photos', '/profile']`.
    - `initialIndex?: number` is the index of the initial entry. By default it's the index of the last entry.

- `onError?: (error: Error, errorInfo: ErrorInfo) => void` is a callback that is called when an error occurs for some route, e.g., when the component or data for a route fails to load. This callback can be used to log the error information to an error reporting service.

- `preloadOnLinkHover?: PreloadContent` (default: `'code'`) is the content to preload for a link's path whenever the link is hovered. See [`PreloadContent`](#preloadcontent).

- `preloadOnLinkPressIn?: PreloadContent` (default: `'code-and-data'`) is the content to preload for a link's path whenever the link is pressed in (mouse down on desktop). See [`PreloadContent`](#preloadcontent).

- `useTransition?: UseTransition` is the `useTransition` hook exported by React. At the moment, `useTransition` is only available in the experimental releases of React, and you need to import it as `unstable_useTransition`. Furthermore, you need to have React Concurrent Mode enabled for `useTransition` to work (read more about [adopting React Concurrent Mode](https://reactjs.org/docs/concurrent-mode-adoption.html#installation)). When you pass the `useTransition` hook, you opt into having a delay during route updates in order to avoid showing undesirable loading states. If we perform a route update without a transition, the new route will render immediately and very likely suspend, showing its fallback component to the user in place of the old route's content. By performing the route update with a transition, we can defer the display of the new route and show the old route while new one is loading. You can use the [`useRouteTransitionPending`](#useroutetransitionpending) hook to know when a route transition is pending and show some sort of loading indicator (in the page header for example) so that the user knows that a route update is actually occuring while still seeing the old route.

### `PreloadContent`

```ts
type PreloadContent = 'code' | 'code-and-data' | 'none';
```

`PreloadContent` is used to specify what type of content to preload for a path even before the navigation to that path occurs. It can be one of the following:

- `'code'` Preload only the code associated with the matching routes, i.e., the components. Note that the code is only loaded once, so it will not be loaded again if it already loaded or is loading.
- `'code-and-data'` Preload both the code and the data associated with the matching routes.
- `'none` Do not preload anything.

### `Router`

```ts
interface Router {
  disableNextRouteTransition: () => void;
  enableNextRouteTransition: () => void;
  getCurrentRouterEntry: () => RouterEntry;
  history: BrowserHistory | MemoryHistory | HashHistory;
  isNextRouteTransitionEnabled: () => boolean;
  options: Required<RouterOptions>;
  preloadBeforeNavigation: (path: string, content: PreloadContent) => void;
  refreshCurrentRouterEntry: () => void;
  removeHistoryListener: () => void;
  subscribe: (subscriber: (routerEntry: RouterEntry) => void) => () => void;
}
```

- `disableNextRouteTransition: () => void;` disables the transition for the next route update. This can be useful when having a transition for the next route update is unwanted because rendering the old route while the new one is loading will result in rendering no longer valid preloaded data, so it's preferrable to immediately render the new route, even if it means to show a loading indicator to the user. This function will disable the transition only for the next route update - once the route updates, transitions are enabled again. This is only applicable when you opt into route transitions by passing the [`useTransition` option](#routeroptions).

- `enableNextRouteTransition: () => void;` enables the transition for the next route update. Transitions are already enabled by default, so calling this function would only make sense to undo a call to `disableNextRouteTransition` before the route updates. Since `disableNextRouteTransition` disables the transition only for the next route update, there's no need to call `enableNextRouteTransition` after the route updates since transitions are enabled again automatically. This is only applicable when you opt into route transitions by passing the [`useTransition` option](#routeroptions).

- `getCurrentRouterEntry: () => RouterEntry` returns the current router entry, which consists of the location object and the preloaded routes for that location.

- `isNextRouteTransitionEnabled: () => boolean;` returns whether the transition for the next route is enabled, i.e., whether there will be a delay in the next route update in order to avoid undesirable loading states. This is only applicable when you opt into route transitions by passing the [`useTransition` option](#routeroptions).

- `history: BrowserHistory | MemoryHistory | HashHistory;` is the history object created with the `history` package, which provides the primitives for route navigation. This history object could be an instance of `BrowserHistory`, `MemoryHistory`, or `HashHistory`, depending on the [`history` option](#routeroptions).

- `options: Required<RouterOptions>` are the options provided to `createRouter` populated with default values for all options that were omitted.

- `preloadBeforeNavigation: (path: string, content: PreloadContent) => void;` preloads the specified [`content`](#preloadcontent) for the given path before the navigation to that path actually occurs. This could be used to start loading code and data for a route even before the user navigates to it, if we know that the user will likely navigate to it. For example, we could start preloading content for a route in an event handler. Note that if the specified `content` is already loaded or is loading for the given `path`, then this function has no effect.

- `refreshCurrentRouterEntry: () => void` refreshes the current router entry by preloading again the components and data for the current entry. Note that if the components already loaded or are still loading, then preloading them again will have no effect.

- `removeHistoryListener: () => void` removes the history listener that the router attached to the history object when it was created. In most applications, we create a router on the startup of the application and use it throughout the entire session. However, if for some reason you need to create another router and replace the original one, you should call this method on the original router object so that it no longer listens to history changes.

- `subscribe: (subscriber: (routerEntry: RouterEntry) => void) => () => void;` subscribes the given callback function to router entry changes. Every time a router entry changes, e.g., when the user clicks on a link or navigates back/forth in history, the current router entry is updated with the new location and the preloaded routes for that location, and the specified callback will be called with this new router entry. A cleanup function is returned that will unsubscribe the callback when called.

### `<PreRouter>`

`<PreRouter>` is the component that is responsible for rendering the routes of your app. It accepts a single `router` prop, which is the `Router` object that was creating with [`createRouter`](#createrouter).

**Example**

```tsx
const router = createRouter(routes, options);

const App = () => <PreRouter router={router} />;
```

### `<Link>`

`<Link>` is the component that is used to create internal links. It accepts a `to` prop specifying a path, and any other prop that an `<a>` element would accept (except `href`).

**Example**

```tsx
<Link to="/profile">Profile</Link>
```

### `<NavLink>`

`<NavLink>` behaves in the same way as `<Link>` but it adds an `active` class to the `className` of the rendered `<a>` element whenever the current path matches the path specified as the `to` prop. This allows you to add custom styles to the link when it points to the same path as that of the current page.

**Example with `styled-components`**

```tsx
const MenuLink = styled(NavLink)`
  color: grey;

  &.active {
    color: green;
  }
`;

const Menu = () => (
  <>
    <MenuLink to="/profile">Profile</MenuLink>
    <MenuLink to="/posts">Posts</MenuLink>
  </>
);
```

### `<Redirect>`

`<Redirect>` is the component that can be used to perform an internal redirect. It accepts a `to` prop specifying the destination path. By default, the new destination will override the current entry in the history stack. If you instead want the new destination to be added to the stack rather than replacing the current enty, you can pass a `push` prop with a value of `true`.

**Example**

```tsx
const ProfilePage = ({ signedInUser }) => {
  if (!signedInUser) {
    return <Redirect to="/sign-in" />;
  }

  return <h1>Welcome {signedInUser.name}</h1>;
};
```

### `useRouter`

The `useRouter` hook returns the [`Router`](#router) object that was specified as the `router` prop to [`<PreRouter>`](#prerouter).

### `usePathname`

The `usePathname` hook returns the current location's pathname.

### `useRouteTransitionPending`

The `useRouteTransitionPending` hook returns a boolean indicating whether a route transition is pending. This allows you to show a loading indicator (in the page header for example) so that the user knows that a route update is actually occuring while still seeing the old route. This is only applicable when you opt into route transitions by passing the [`useTransition` option](#routeroptions).

## Prior art

`pre-router` was inspired by the router of the [Relay Hooks Example App](https://github.com/relayjs/relay-examples/tree/master/issue-tracker).

## Contributing

Pull requests are very welcome. If you intend to introduce a major change, please open a related issue first in which we can discuss what you would like to change.

Please make sure to update the tests and the README as appropriate.

## License

[MIT](https://github.com/kyarik/pre-router/blob/master/LICENSE)
