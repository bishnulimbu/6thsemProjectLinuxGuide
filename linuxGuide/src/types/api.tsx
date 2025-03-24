export interface SingupRequest {
  username: string;
  password: string;
}
export interface SIngupResponse {
  message: string;
  userId?: number;
  token?: string;
}
