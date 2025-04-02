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

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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
  user: { id: number; username: string; email: string };
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
//update post
export const updatePost = async (
  id: number,
  post: { title: string; content: string; tags: string[] },
): Promise<Post> => {
  try {
    const response = await api.put(`/posts/${id}`, post);
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Failed to update post.", err.status);
  }
};
//craet guide
export const createGuide = async (guide: {
  title: string;
  description: string;
  status: "draft" | "published";
}): Promise<Guide> => {
  try {
    const response = await api.post("/guides", guide);
    return response.data;
  } catch (err: any) {
    throw new ApiError(
      err.message || "Falied to create new guide.",
      err.status,
    );
  }
};
//guide update
export const updateGuide = async (
  id: number,
  guide: { title: string; description: string; status: "draft" | "published" },
): Promise<Guide> => {
  try {
    const response = await api.put(`/guides/${id}`, guide);
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Failed to update guide.", err.status);
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
export const createComment = async (comment: {
  content: string;
  guideId: number | null;
  postId: number | null;
}): Promise<Comment> => {
  try {
    if (comment.guideId) {
      const response = await api.post(`/comments/guide/${comment.guideId}`, {
        content: comment.content,
      });
      return response.data;
    } else if (comment.postId) {
      const response = await api.post(`/comments/post/${comment.postId}`, {
        content: comment.content,
      });
      return response.data;
    } else {
      throw new Error("guideId or postId is required");
    }
  } catch (err: any) {
    throw new ApiError(err.message || "Failed to create comment", err.status);
  }
};

// Delete a comment
export const deleteComment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/comments/${id}`);
  } catch (err: any) {
    throw new ApiError(err.message || "Failed to delete comment", err.status);
  }
};
// Fetch a specific user by ID
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
  } catch (err: any) {
    throw new ApiError(err.message || "Failed to fetch user", err.status);
  }
};

// Update a user
export const updateUser = async (
  id: number,
  userData: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  },
): Promise<void> => {
  try {
    await api.put(`/auth/users/${id}`, userData);
  } catch (err: any) {
    throw new ApiError(err.message || "Failed to update user", err.status);
  }
};

export default api;
