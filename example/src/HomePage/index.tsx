import { Link } from 'pre-router';
import * as React from 'react';
import { CenteredContent } from '~/CenteredContent';

const HomePage = () => (
  <CenteredContent>
    <h1>Home page</h1>
    <p>
      Visit the <Link to="/profile">profile</Link> page.
    </p>
  </CenteredContent>
);

export default HomePage;
