import { RouteComponent } from 'pre-router';
import * as React from 'react';
import { PreloadedRootData } from './data';
import { Footer } from './Footer';
import { Header } from './Header';

const Root: RouteComponent<PreloadedRootData> = ({ preloadedData, children }) => {
  const signedInUser = preloadedData.signedInUserResource.read();

  return (
    <>
      <Header signedInUser={signedInUser} />
      {children}
      <Footer />
    </>
  );
};

export default Root;
