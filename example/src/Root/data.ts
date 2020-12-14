import { lazyResource } from 'suspendable';
import { fetchSignedInUser } from '~/fakeApi/signedInUser';

export const preloadRootData = () => {
  const resource = lazyResource(fetchSignedInUser);

  resource.load();

  return {
    signedInUserResource: resource,
  };
};

export type PreloadedRootData = ReturnType<typeof preloadRootData>;
