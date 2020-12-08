import React, { VFC } from 'react';

interface Props {
  error: Error;
  retry: () => void;
}

export const DefaultErrorFallback: VFC<Props> = ({ error, retry }) => (
  <>
    <h1>{error.name}</h1>
    <pre>{error.message}</pre>
    <button onClick={retry}>Retry</button>
  </>
);
