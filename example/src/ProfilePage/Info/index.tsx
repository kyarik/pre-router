import * as React from 'react';
import { Resource } from 'suspendable';
import { UserInfo } from '~/types';

interface Props {
  userInfoResource: Resource<UserInfo>;
}

export const Info: React.VFC<Props> = ({ userInfoResource }) => {
  const { name, profession, online } = userInfoResource.read();

  return (
    <>
      <h1>
        {name} ({online ? 'online' : 'offline'})
      </h1>
      <h3>{profession}</h3>
    </>
  );
};
