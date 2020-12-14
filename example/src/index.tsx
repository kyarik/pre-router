import { createRouter, PreRouter } from 'pre-router';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GlobalStyles } from './GlobalStyles';
import { Loading } from './Loading';
import { routes } from './routes';

const router = createRouter(routes, {
  defaultFallback: Loading,
});

const App = () => (
  <>
    <GlobalStyles />
    <PreRouter router={router} />
  </>
);

ReactDOM.render(<App />, document.getElementById('root'));
