import { SignedInUser } from '~/types';

const signedInUser: SignedInUser = {
  name: 'Tom',
};

let promise: Promise<SignedInUser> | null = null;

export const fetchSignedInUser = () => {
  if (!promise) {
    promise = new Promise<SignedInUser>(resolve => {
      setTimeout(() => resolve(signedInUser), 1000);
    });
  }

  return promise;
};
