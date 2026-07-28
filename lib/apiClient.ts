import axios, { AxiosError } from "axios";
import { getAccessToken, clearAccessToken } from "@/features/auth/tokenStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// یه فیلد سفارشی به کانفیگ axios اضافه می‌کنیم تا بشه درخواست‌هایی مثل
// login/register رو از اضافه‌شدن هدر Authorization معاف کرد.
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    // چون فعلا refresh token نداریم، با انقضا/نامعتبر شدن توکن فقط کاربر رو
    // خارج می‌کنیم تا دوباره وارد بشه (نه یه رفرش خودکار).
    if (error.response?.status === 401) clearAccessToken();

    const message = error.response?.data?.message || error.message || "خطایی رخ داد";
    return Promise.reject(new Error(message));
  }
);
