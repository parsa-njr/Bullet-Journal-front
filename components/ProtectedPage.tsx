"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import ProfileMini from "./ProfileMini";

const NAV_ITEMS = [
  { href: "/dashboard", label: "امروز" },
  { href: "/calendar", label: "تقویم" },
  { href: "/weekly-plan", label: "هفته" },
  { href: "/monthly-plan", label: "ماه" },
];

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
      <header className="flex items-center justify-between border-b border-line bg-paper/90 px-6 py-4 backdrop-blur">
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-ink-light transition hover:bg-ink/5 hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <h1 className="font-display text-lg font-bold text-ink">بولت ژورنال من</h1>
        <ProfileMini />
      </header>
      <main className="mx-auto max-w-3xl px-6 py-8">{children}</main>
    </div>
  );
}
