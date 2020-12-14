import * as React from 'react';
import { Resource } from 'suspendable';
import { Friend } from '~/types';

interface Props {
  friendsResource: Resource<Friend[]>;
}

export const Friends: React.VFC<Props> = ({ friendsResource }) => {
  const friends = friendsResource.read();

  return (
    <>
      <h2>{friends.length} friends</h2>

      {friends.map(friend => (
        <h3 key={friend.id}>
          {friend.name} ({friend.online ? 'online' : 'offline'})
        </h3>
      ))}
    </>
  );
};
