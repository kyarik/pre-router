import { Post } from '~/types';

const posts: Post[] = [
  {
    id: 1,
    slug: 'first-post',
    title: 'First post',
    body: 'This is the very first post.',
  },
  {
    id: 2,
    slug: 'second-post',
    title: 'Second post',
    body: 'This is the second post.',
  },
];

export const fetchPosts = () =>
  new Promise<Post[]>(resolve => {
    setTimeout(() => resolve(posts), 2500);
  });

export const fetchPostBySlug = (slug: string) =>
  new Promise<Post | null>(resolve => {
    setTimeout(() => {
      const post = posts.find(p => p.slug === slug);

      resolve(post || null);
    }, 1500);
  });
