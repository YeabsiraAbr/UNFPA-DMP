import { api } from "./api-client";
import type { Role, SuccessResponse } from "./types";

export const rolesService = {
  async getAll(): Promise<{ success: boolean; roles: Role[] }> {
    const raw = await api.get<Record<string, unknown>>("/role");
    const roles = (raw.data ?? raw.roles ?? []) as Role[];
    return { success: true, roles };
  },

  async assign(userId: string, roleId: string): Promise<SuccessResponse> {
    await api.post("/role/assign", { body: { userId, roleId } });
    return { success: true };
  },

  async remove(userId: string, roleId: string): Promise<SuccessResponse> {
    await api.post("/role/remove", { body: { userId, roleId } });
    return { success: true };
  },
};
