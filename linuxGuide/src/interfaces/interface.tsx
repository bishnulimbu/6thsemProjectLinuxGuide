export interface AuthResponse {
  token: string;
  role: string;
  content: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Guide {
  id: number;
  title: string;
  status: "draft" | "published";
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: any;
}
export interface Tag {
  id?: number;
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: any;
  Tags?: Tag[]; // Add Tags field
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  guideId?: number;
  postId?: number;
  createdAt: string;
  updatedAt: string;
  User?: { username: string };
}
// Base interface for common properties
export interface SearchResult {
  id: number;
  title: string;
  userId: number;
  type: "guide" | "post"; // Added type field (union type for the dynamic value)
  tags: Tag[]; // Tags are always present, but empty for guides
}

export interface Guide extends SearchResult {
  type: "guide"; // Literal type for Guide
  description: string;
  tags: []; // Guides have an empty tags array
}

export interface Post extends SearchResult {
  type: "post"; // Literal type for Post
  content: string;
  tags: Tag[]; // Posts can have tags
}
