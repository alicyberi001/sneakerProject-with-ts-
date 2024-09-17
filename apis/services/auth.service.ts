import { urls } from "../urls";
import { httpClient } from "../client";

interface LoginData {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  expiration: number;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await httpClient().post(urls.auth.login, data);
  return response.data;
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await httpClient().post(urls.auth.signup, data);
  return response.data;
}
