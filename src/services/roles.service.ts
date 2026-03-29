import { api } from "./api-client";
import type { Role, SuccessResponse } from "./types";

export interface RoleAssignApiResult {
  userId: string;
  roleName: string;
}

/** Backend expects enum-style names, e.g. "ADMIN". */
export function roleNameForApi(role: Pick<Role, "name">): string {
  return String(role.name ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function parseAssignResult(raw: Record<string, unknown>): RoleAssignApiResult | undefined {
  const result = (raw.result ?? raw.data) as Record<string, unknown> | undefined;
  if (!result || typeof result !== "object") return undefined;
  const uid = result.userId;
  const rname = result.roleName;
  if (typeof uid === "string" && typeof rname === "string") {
    return { userId: uid, roleName: rname };
  }
  return undefined;
}

export const rolesService = {
  async getAll(): Promise<{ success: boolean; roles: Role[] }> {
    const raw = await api.get<Record<string, unknown>>("/role");
    const roles = (raw.data ?? raw.roles ?? []) as Role[];
    return { success: true, roles };
  },

  async assign(
    userId: string,
    roleName: string
  ): Promise<{ success: boolean; result?: RoleAssignApiResult }> {
    const raw = await api.post<Record<string, unknown>>("/role/assign", { body: { userId, roleName } });
    return {
      success: Boolean(raw.success ?? true),
      result: parseAssignResult(raw),
    };
  },

  async remove(userId: string, roleName: string): Promise<SuccessResponse> {
    await api.post("/role/remove", { body: { userId, roleName } });
    return { success: true };
  },
};
