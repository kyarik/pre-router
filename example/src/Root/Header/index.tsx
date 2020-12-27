import * as React from 'react';
import styled from 'styled-components';
import { Resource } from 'suspendable';
import { SignedInUser } from '~/types';
import { HeaderLink } from './HeaderLink';
import { HeaderUser } from './HeaderUser';

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background-color: lightcoral;
  padding: 0 32px;
`;

interface Props {
  signedInUserResource: Resource<SignedInUser>;
}

export const Header: React.VFC<Props> = ({ signedInUserResource }) => (
  <Container>
    <nav>
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/profile">Profile</HeaderLink>
    </nav>

    <React.Suspense fallback="Loading user...">
      <HeaderUser signedInUserResource={signedInUserResource} />
    </React.Suspense>
  </Container>
);
