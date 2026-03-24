const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const TOKEN_KEY = "unfpa_access_token";
const REFRESH_KEY = "unfpa_refresh_token";

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ---------------------------------------------------------------------------
// Typed response
// ---------------------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    const msg =
      typeof body === "object" && body !== null && "message" in body
        ? String((body as Record<string, unknown>).message)
        : `Request failed with status ${status}`;
    super(msg);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  formData?: FormData;
  noAuth?: boolean;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = await res.json();
    if (data.accessToken) {
      setTokens(data.accessToken, data.refreshToken ?? refreshToken);
      return data.accessToken;
    }
    return null;
  } catch {
    clearTokens();
    return null;
  }
}

async function request<T = unknown>(
  method: Method,
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const { body, headers: extraHeaders, params, formData, noAuth } = opts;

  let url = `${BASE_URL}${path}`;
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join("&");
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = { ...extraHeaders };
  if (!noAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let fetchBody: BodyInit | undefined;
  if (formData) {
    fetchBody = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  let res = await fetch(url, { method, headers, body: fetchBody });

  // Auto-refresh on 401
  if (res.status === 401 && !noAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, { method, headers, body: fetchBody });
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new ApiError(res.status, errorBody);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public helpers used by every service
// ---------------------------------------------------------------------------

export const api = {
  get: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>("GET", path, opts),
  post: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>("POST", path, opts),
  patch: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>("PATCH", path, opts),
  put: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>("PUT", path, opts),
  delete: <T = unknown>(path: string, opts?: RequestOptions) =>
    request<T>("DELETE", path, opts),
};
