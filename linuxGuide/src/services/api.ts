import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Signup failed");
  }
};

export const signup = async (username: string, password: string) => {
  try {
    const response = await api.post("/auth/signup", {
      username,
      password,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Signup failed");
  }
};

export const adminSignup = async (
  username: string,
  password: string,
  role: string,
) => {
  try {
    const response = await api.post("/auth/admin/signup", {
      username,
      password,
      role,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Signup failed");
  }
};

export const getGuides = async () => {
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
