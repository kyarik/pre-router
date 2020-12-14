export interface SignedInUser {
  name: string;
}

export interface UserInfo {
  name: string;
  profession: string;
  online: boolean;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  body: string;
}

export interface Friend {
  id: number;
  name: string;
  online: boolean;
}
