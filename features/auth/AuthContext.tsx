"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // اگه اصلا توکنی ذخیره نشده، بدون درخواست اضافه به سرور مستقیم رد می‌شیم
    if (!getAccessToken()) {
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(phone: string, password: string) {
    const data = await authApi.login({ phone, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    router.push("/dashboard");
  }

  async function register(name: string, phone: string, password: string) {
    const data = await authApi.register({ name, phone, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    router.push("/dashboard");
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      clearAccessToken();
      setUser(null);
      router.push("/login");
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth باید داخل AuthProvider استفاده شود");
  return ctx;
}
