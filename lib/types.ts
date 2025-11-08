// Data models for The URList

export interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
}

export interface LinkBundle {
  id: string;
  vanityUrl: string;
  description: string;
  userId: string;
  provider: string;
  links: Link[];
}

export interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  provider?: string;
}
