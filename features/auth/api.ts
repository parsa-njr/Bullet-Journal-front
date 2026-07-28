import { apiClient } from "@/lib/apiClient";
import type { AuthResponse, MeResponse, RegisterPayload, LoginPayload } from "./types";

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient
      .post<AuthResponse>("/auth/register", payload, { skipAuth: true })
      .then((res) => res.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload, { skipAuth: true }).then((res) => res.data),

  logout: () => apiClient.post<{ message: string }>("/auth/logout").then((res) => res.data),

  getMe: () => apiClient.get<MeResponse>("/auth/me").then((res) => res.data),
};
