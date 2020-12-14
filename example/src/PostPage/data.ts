import { lazyResource } from 'suspendable';
import { fetchPostBySlug } from '~/fakeApi/posts';

export const preloadPost = (slug: string) => {
  const resource = lazyResource(() => fetchPostBySlug(slug));

  resource.load();

  return resource;
};

export type PreloadedPost = ReturnType<typeof preloadPost>;
