"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, phone, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-grid px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white/70 p-8 shadow-sm">
        <h1 className="mb-1 text-center font-display text-2xl font-bold text-ink">
          بولت ژورنال من
        </h1>
        <p className="mb-6 text-center text-sm text-ink-light">یه حساب جدید بساز</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            required
            placeholder="نام"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink-light focus:outline-none"
          />
          <input
            type="tel"
            required
            placeholder="شماره موبایل"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink-light focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="رمز عبور (حداقل ۶ کاراکتر)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink-light focus:outline-none"
          />

          {error && <p className="text-xs text-rose">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-ink py-2 text-sm font-medium text-paper transition hover:bg-ink-light disabled:opacity-50"
          >
            {loading ? "در حال ساخت حساب..." : "ثبت‌نام"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-light">
          حساب داری؟{" "}
          <Link href="/login" className="font-medium text-ink underline">
            وارد شو
          </Link>
        </p>
      </div>
    </div>
  );
}
