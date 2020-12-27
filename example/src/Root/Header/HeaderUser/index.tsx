import * as React from 'react';
import { Resource } from 'suspendable';
import { SignedInUser } from '~/types';
import { HeaderLink } from '../HeaderLink';

interface Props {
  signedInUserResource: Resource<SignedInUser>;
}

export const HeaderUser: React.VFC<Props> = ({ signedInUserResource }) => {
  const signedInUser = signedInUserResource.read();

  return (
    <div>
      {signedInUser ? (
        <span>Welcome {signedInUser.name}</span>
      ) : (
        <HeaderLink to="/sign-in">Sign in</HeaderLink>
      )}
    </div>
  );
};
