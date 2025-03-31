import axios, { AxiosError } from "axios";
import {
  AuthResponse,
  User,
  Guide,
  Post,
  Comment,
} from "../interfaces/interface";

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as any)?.error || error.message;
    const status = error.response?.status;
    throw new ApiError(message, status);
  },
);

//auth api call
export const login = async (
  username: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Signup failed", err.status);
  }
};
// Rename createAdminUser to adminSignup for consistency
export const adminSignup = async (data: {
  username: string;
  email: string;
  password: string;
}): Promise<{
  message: string;
  user: { id: number; username: string; email: string; role: string };
}> => {
  try {
    const response = await api.post("/auth/admin-signup", data);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Failed to create admin user",
      err.status,
    );
  }
};
export const signup = async (
  username: string,
  password: string,
  email: string,
): Promise<{ message: string; useId: number; role: string }> => {
  try {
    const response = await api.post("/auth/signup", {
      username,
      password,
      email,
    });
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Singup failed", err.status);
  }
};

//Guide api calls
export const getGuides = async (): Promise<Guide[]> => {
  try {
    const response = await api.get("/guides");
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.messagee || "Falled to fetch guides.", err.status);
  }
};

export const getGuideById = async (id: number): Promise<Guide> => {
  try {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.messagee || "Falled to fetch this guide.",
      err.status,
    );
  }
};

//post api calls
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.messsage || "failed to fetch posts", err.status);
  }
};
// Get a single post by ID (GET /api/posts/:id)
export const getPostById = async (id: number): Promise<Post> => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || `Failed to fetch post with ID ${id}`,
      err.status,
    );
  }
};

export const createPost = async (post: {
  title: string;
  content: string;
  tags: string[];
}): Promise<Post> => {
  try {
    const response = await api.post("/posts", post);
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Falied to create new post.", err.status);
  }
};

export const getCommentsForGuide = async (
  guideId: number,
): Promise<Comment[]> => {
  try {
    const response = await api.get(`/comments/guide/${guideId}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Failed to fetch comments for guide ${guideId}",
      err.status,
    );
  }
};

export const getCommentsForPost = async (
  postId: number,
): Promise<Comment[]> => {
  try {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Failed to fetch comments for post ${postId}",
      err.status,
    );
  }
};

export const createCommentForGuide = async (
  guideId: number,
  content: string,
): Promise<Comment> => {
  try {
    const response = await api.post(`/comments/guide/${guideId}`, { content });
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Failed to create comment for guide ${guideId}",
      err.status,
    );
  }
};

export const createCommentForPost = async (
  postId: number,
  content: string,
): Promise<Comment> => {
  try {
    const response = await api.post(`/comments/post/${postId}`, { content });
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Failed to create comment for post ${postId}",
      err.status,
    );
  }
};

export const deleteComment = async (
  id: number,
): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Failed to delete comment ${id}",
      err.status,
    );
  }
};

//api calls for admin
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/auth/users");
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Failed to fetch users.", err.status);
  }
};
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || `Failed to delete user with id ${id}`,
      err.status,
    );
  }
};

export const deleteGuide = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/guides/${id}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || `Failed to delete guide with id ${id}`,
      err.status,
    );
  }
};
export const deletePost = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || `Failed to delete post with id ${id}`,
      err.status,
    );
  }
};
export const submitContactForm = async (data: {
  name: string;
  email: string;
  message: string;
}) => {
  try {
    const response = await api.post("/contact", data);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Failed to submit contact form",
      err.status,
    );
  }
};
// Update guide status (PATCH /api/guides/:id)
export const updateGuideStatus = async (
  id: number,
  status: "draft" | "published",
): Promise<{ message: string; guide: Guide }> => {
  try {
    const response = await api.patch(`/guides/${id}`, { status });
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || `Failed to update guide status for ID ${id}`,
      err.status,
    );
  }
};

export default api;
