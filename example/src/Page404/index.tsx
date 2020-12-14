import { Link } from 'pre-router';
import * as React from 'react';
import { CenteredContent } from '~/CenteredContent';

const Page404 = () => (
  <CenteredContent>
    <h1>404: Page not found</h1>
    <p>
      Go to the <Link to="/">home</Link> page.
    </p>
  </CenteredContent>
);

export default Page404;
