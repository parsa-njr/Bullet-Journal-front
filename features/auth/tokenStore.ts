// چون فعلا refresh token نداریم، access token رو هم توی متغیر حافظه (برای دسترسی سریع)
// و هم توی localStorage (برای زنده موندن بعد از رفرش صفحه) نگه می‌داریم.
// نکته: نگه‌داشتن access token توی localStorage در برابر حملات XSS آسیب‌پذیره؛
// وقتی refresh token اضافه شد، بهتره به الگوی httpOnly cookie + short-lived access token برگردیم.

const STORAGE_KEY = "access_token";

let inMemoryToken: string | null = null;

export function getAccessToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  inMemoryToken = stored;
  return stored;
}

export function setAccessToken(token: string): void {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, token);
  }
}

export function clearAccessToken(): void {
  inMemoryToken = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
