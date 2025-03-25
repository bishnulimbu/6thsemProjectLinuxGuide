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

export default api;

export const getGuides = async () => {
  const response = await api.get("/guides");
  return response.data;
};

export const getGuideById = async (id: number) => {
  const response = await api.get(`/guides/${id}`);
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

export const getComments = async (GuideId: number) => {};
