import { RouteComponent } from 'pre-router';
import * as React from 'react';
import { CenteredContent } from '~/CenteredContent';
import { PreloadedPost } from './data';

const PostPage: RouteComponent<PreloadedPost> = ({ preloadedData, params }) => {
  const post = preloadedData.read();

  if (!post) {
    return (
      <CenteredContent>
        <h1>Post with slug '{params.slug}' not found.</h1>
      </CenteredContent>
    );
  }

  return (
    <CenteredContent>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </CenteredContent>
  );
};

export default PostPage;
