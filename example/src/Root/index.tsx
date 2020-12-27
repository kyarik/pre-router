import { RouteComponent } from 'pre-router';
import * as React from 'react';
import { Content } from './Content';
import { PreloadedRootData } from './data';
import { Footer } from './Footer';
import { Header } from './Header';

const Root: RouteComponent<PreloadedRootData> = ({ preloadedData, children }) => {
  const { signedInUserResource } = preloadedData;

  return (
    <>
      <Header signedInUserResource={signedInUserResource} />
      <Content>{children}</Content>
      <Footer />
    </>
  );
};

export default Root;
