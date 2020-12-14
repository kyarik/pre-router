import * as React from 'react';
import { Resource } from 'suspendable';
import { Post } from '~/types';
import { Link } from 'pre-router';

interface Props {
  postsResource: Resource<Post[]>;
}

export const Posts: React.VFC<Props> = ({ postsResource }) => {
  const posts = postsResource.read();

  return (
    <>
      <h2>{posts.length} posts</h2>

      {posts.map(post => (
        <h3 key={post.id}>
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
      ))}
    </>
  );
};
