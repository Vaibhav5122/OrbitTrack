import { api, setAccessToken } from "./axios";
import type {
  LoginUserFormValues,
  RegisterUserFormValues,
} from "../validations/auth.validation";

export type UserRole = "ADMIN" | "PROJECT_MANAGER" | "DEVELOPER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function loginUser(payload: LoginUserFormValues): Promise<AuthResponseData> {
  const response = await api.post<ApiResponse<AuthResponseData>>("/auth/login", payload);
  setAccessToken(response.data.data.accessToken);
  return response.data.data;
}

export async function registerUser(payload: RegisterUserFormValues): Promise<AuthResponseData> {
  const { confirmPassword: _, ...registerData } = payload;
  const response = await api.post<ApiResponse<AuthResponseData>>("/auth/register", registerData);
  setAccessToken(response.data.data.accessToken);
  return response.data.data;
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    setAccessToken(null);
  }
}

export async function getMe(): Promise<User> {
  const response = await api.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
}
