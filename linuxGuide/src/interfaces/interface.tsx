export interface AuthResponse {
  token: string;
  role: string;
  content: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface Guide {
  id: number;
  title: string;
  status: "draft" | "published";
  description: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User: { username: string };
}
export interface Tag {
  name: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  User?: { username: string };
  Tags?: Tag[]; // Add Tags field
}

export interface Comment {
  id: number;
  content: string;
  guideId?: number;
  postId?: number;
}
