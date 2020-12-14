import { Friend } from '~/types';

const friends: Friend[] = [
  {
    id: 1,
    name: 'Jessica',
    online: true,
  },
  {
    id: 2,
    name: 'Frank',
    online: false,
  },
  {
    id: 3,
    name: 'Jim',
    online: true,
  },
];

export const fetchFriends = () =>
  new Promise<Friend[]>(resolve => {
    setTimeout(() => resolve(friends), 3000);
  });
