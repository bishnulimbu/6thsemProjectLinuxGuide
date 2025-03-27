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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer${token}`;
  }
  return config;
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
  const response = await api.get("/guides");
  return response.data;
};

export const getGuideById = async (id: number) => {
  const response = await api.get(`/guides/${id}`);
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export const createPost = async (post: {
  title: string;
  content: string;
  tags: string;
  status: "draft" | "published" | "archived";
}) => {
  const response = await api.post("/posts", post);
  return response.data;
};

export const getCommentsForGuide = async (guideId: number) => {
  const response = await api.get(`/comments/guide/${guideId}`);
  return response.data;
};

export const getCommentsForPost = async (postId: number) => {
  const response = await api.get(`/comments/post/${postId}`);
  return response.data;
};

export const createCommentForGuide = async (
  guideId: number,
  content: string,
) => {
  const response = await api.post(`/comments/guide/${guideId}`, { content });
  return response.data;
};

export const createCommentForPost = async (postId: number, content: string) => {
  const response = await api.post(`/comments/post/${postId}`, { content });
  return response.data;
};

export const deleteComment = async (id: number) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

export default api;
