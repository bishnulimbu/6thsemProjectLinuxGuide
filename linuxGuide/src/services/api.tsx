import axios, { AxiosError } from "axios";

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
interface AuthResponse {
  token: string;
  role: string;
  content: string;
}
interface User {
  id: number;
  username: string;
  role: string;
}

interface Guide {
  id: number;
  title: string;
  content: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  tags: string;
  status: "draft" | "published" | "archived";
}

interface Comment {
  id: number;
  content: string;
  guideId?: number;
  postId?: number;
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

export const signup = async (
  username: string,
  password: string,
): Promise<{ message: string; useId: number; role: string }> => {
  try {
    const response = await api.post("/auth/signup", {
      username,
      password,
    });
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Singup failed", err.status);
  }
};

export const adminSignup = async (
  username: string,
  password: string,
  role: string,
): Promise<{ message: string; userId: number; role: string }> => {
  try {
    const response = await api.post("/auth/admin-signup", {
      username,
      password,
      role,
    });
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Admin singup failed", err.status);
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
export const getPosts = async (): Promise<Post> => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.messsage || "failed to fetch posts", err.status);
  }
};

export const createPost = async (post: {
  title: string;
  content: string;
  tags: string;
  status: "draft" | "published" | "archived";
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

export default api;
