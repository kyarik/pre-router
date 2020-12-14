import { lazyResource } from 'suspendable';
import { fetchFriends } from '~/fakeApi/friends';
import { fetchPosts } from '~/fakeApi/posts';
import { fetchUserInfo } from '~/fakeApi/userInfo';

export const preloadProfileData = () => {
  const userInfoResource = lazyResource(fetchUserInfo);
  const postsResource = lazyResource(fetchPosts);
  const friendsResource = lazyResource(fetchFriends);

  userInfoResource.load();
  postsResource.load();
  friendsResource.load();

  return {
    userInfoResource,
    postsResource,
    friendsResource,
  };
};

export type PreloadedProfileData = ReturnType<typeof preloadProfileData>;
