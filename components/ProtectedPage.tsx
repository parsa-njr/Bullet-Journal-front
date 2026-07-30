"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import TopNavbar from "./TopNavbar";

export default function ProtectedPage({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-grid">
        <p className="font-mono text-sm text-ink-light">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper-grid">
      <TopNavbar />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>    </div>
  );
}