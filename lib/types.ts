// TypeScript interfaces for the application

export interface User {
  id: string;
  provider: string;
  name: string | null;
  image: string | null;
  email: string | null;
  created_at: string;
}

export interface Link {
  id: string;
  bundle_id: string;
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  sort_order: number;
  created_at: string;
}

export interface LinkBundle {
  id: string;
  user_id: string;
  vanity_url: string;
  title: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  links?: Link[];
}

export interface LinkBundleWithLinks extends LinkBundle {
  links: Link[];
}

// For NextAuth session
export interface ClientPrincipal {
  userId: string;
  userRoles: string[];
  claims: { typ: string; val: string }[];
  identityProvider: string;
  userDetails: string;
}

// Form data types
export interface CreateLinkBundleInput {
  vanity_url: string;
  title?: string;
  description?: string;
  links: CreateLinkInput[];
}

export interface CreateLinkInput {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  sort_order: number;
}

export interface UpdateLinkBundleInput {
  title?: string;
  description?: string;
  links?: CreateLinkInput[];
}

// Open Graph metadata
export interface OpenGraphMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}
