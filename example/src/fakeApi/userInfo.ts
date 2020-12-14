import { UserInfo } from '~/types';

const userInfo: UserInfo = {
  name: 'Tom',
  profession: 'Engineer',
  online: true,
};

export const fetchUserInfo = () =>
  new Promise<UserInfo>(resolve => {
    setTimeout(() => resolve(userInfo), 2000);
  });
