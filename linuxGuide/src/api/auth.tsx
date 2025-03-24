import api from "./axios";
import { SignupResponse, SingupRequest } from "./types";

const signup = async (data: SingupRequest): Promise<SingupResponse> => {
  const response = await api.post<SignupResponse>("/auth/singup", data);
  return response.data;
};

const login = async (data: SingupRequest): Promise<SingupResponse> => {
  const response = await api.post<SignupResponse>("/auth/login", data);
  return response.data;
};

export { signup, login };
