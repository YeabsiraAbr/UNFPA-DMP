import { api } from "./api-client";
import type { User } from "./types";

function normalizeListUser(o: Record<string, unknown>): User | null {
  const id = String(o.id ?? o.userId ?? "").trim();
  if (!id) return null;
  return {
    id,
    phone: String(o.phone ?? o.phoneNumber ?? ""),
    fullName: (o.fullName ?? o.name ?? null) as string | null,
    isActive: Boolean(o.isActive ?? true),
    createdAt: String(o.createdAt ?? new Date().toISOString()),
  };
}

function extractUserArray(raw: Record<string, unknown>): unknown[] {
  const direct = raw.data ?? raw.users ?? raw.items ?? raw.results;
  if (Array.isArray(direct)) return direct;
  if (direct && typeof direct === "object") {
    const inner = direct as Record<string, unknown>;
    const nested = inner.users ?? inner.data ?? inner.items;
    if (Array.isArray(nested)) return nested;
  }
  if (Array.isArray(raw)) return raw as unknown[];
  return [];
}

export const userService = {
  /**
   * Lists users when the backend exposes GET /users or GET /user (optional).
   * Returns an empty list if no route matches or all requests fail.
   */
  async list(): Promise<{ success: boolean; users: User[] }> {
    const paths = ["/users", "/user"] as const;
    for (const path of paths) {
      try {
        const raw = await api.get<Record<string, unknown>>(path);
        const rows = extractUserArray(raw);
        const users = rows
          .map((row) =>
            row && typeof row === "object" ? normalizeListUser(row as Record<string, unknown>) : null
          )
          .filter((u): u is User => u !== null);
        return { success: true, users };
      } catch {
        /* try next path */
      }
    }
    return { success: true, users: [] };
  },
};
