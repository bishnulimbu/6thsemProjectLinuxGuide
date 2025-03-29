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
  content: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string;
  status: "draft" | "published" | "archived";
}

export interface Comment {
  id: number;
  content: string;
  guideId?: number;
  postId?: number;
}
