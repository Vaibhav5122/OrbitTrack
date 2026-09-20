"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  loginUser,
  registerUser,
  logoutUser,
  getMe,
  type AuthResponseData,
  type User,
} from "@/lib/api/auth";
import { LoginUserFormValues, RegisterUserFormValues } from "../validations/auth.validation";
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponseData, Error, LoginUserFormValues>({
    mutationFn: (credentials: LoginUserFormValues) => loginUser(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.user);
      toast.success("Login successful", {
        description: `Welcome back, ${data.user.name}!`,
      });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to login. Please check your credentials.";
      toast.error("Login failed", {
        description: message,
      });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponseData, Error, RegisterUserFormValues>({
    mutationFn: (data: RegisterUserFormValues) => registerUser(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "user"], data.user);
      toast.success("Account created successfully", {
        description: `Welcome to OrbitTrack, ${data.user.name}!`,
      });
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please verify your details.";
      toast.error("Registration failed", {
        description: message,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);
      queryClient.clear();
      toast.success("Logged out successfully");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error("Logout failed", {
        description: err.message || "An error occurred during logout",
      });
    },
  });
}

export function useUser() {
  return useQuery<User, Error>({
    queryKey: ["auth", "user"],
    queryFn: () => getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
