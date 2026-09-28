const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setTokenCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

export function clearTokenCookie() {
  document.cookie = "token=; path=/; max-age=0";
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Error en la solicitud");
  }
  return data;
}

export { API_URL };