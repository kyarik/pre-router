import * as React from 'react';
import styled from 'styled-components';
import { NavLink } from 'pre-router';
import { SignedInUser } from '~/types';

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  background-color: lightcoral;
  padding: 0 32px;
`;

const HeaderLink = styled(NavLink)`
  color: black;
  font-size: 20px;
  text-decoration: none;

  &.active {
    color: indigo;
  }

  & ~ & {
    padding-left: 16px;
  }
`;

interface Props {
  signedInUser: SignedInUser;
}

export const Header: React.VFC<Props> = ({ signedInUser }) => (
  <Container>
    <nav>
      <HeaderLink to="/">Home</HeaderLink>
      <HeaderLink to="/profile">Profile</HeaderLink>
    </nav>

    <div>
      {signedInUser ? (
        <span>Welcome {signedInUser.name}</span>
      ) : (
        <HeaderLink to="/sign-in">Sign in</HeaderLink>
      )}
    </div>
  </Container>
);
