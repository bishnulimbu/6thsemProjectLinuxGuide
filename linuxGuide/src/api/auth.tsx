import api from "./axios";

const signup = async (username: string, password: string) => {
  const response = await api.post("/auth/singup", {
    username,
    password,
  });
  return response.data;
};

const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });
  return response.data;
};

export { signup, login };
