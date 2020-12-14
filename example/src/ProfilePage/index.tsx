import { RouteComponent } from 'pre-router';
import * as React from 'react';
import { CenteredContent } from '~/CenteredContent';
import { PreloadedProfileData } from './data';
import { Friends } from './Friends';
import { Info } from './Info';
import { Posts } from './Posts';

const ProfilePage: RouteComponent<PreloadedProfileData> = ({ preloadedData }) => {
  const { userInfoResource, postsResource, friendsResource } = preloadedData;

  return (
    <CenteredContent>
      <Info userInfoResource={userInfoResource} />

      <React.Suspense fallback={<h3>Loading posts...</h3>}>
        <Posts postsResource={postsResource} />

        <React.Suspense fallback={<h3>Loading friends...</h3>}>
          <Friends friendsResource={friendsResource} />
        </React.Suspense>
      </React.Suspense>
    </CenteredContent>
  );
};

export default ProfilePage;
