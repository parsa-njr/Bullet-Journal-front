"use client";

import { useAuth } from "@/features/auth/AuthContext";

export default function ProfileMini() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initial = user.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper">
          {initial}
        </div>
        <span className="hidden text-sm text-ink-light sm:inline">{user.name}</span>
      </div>
      <button
        onClick={logout}
        className="rounded-full border border-line px-3 py-1 text-xs text-ink-light transition hover:border-rose hover:text-rose"
      >
        خروج
      </button>
    </div>
  );
}
