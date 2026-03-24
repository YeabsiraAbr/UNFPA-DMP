import { api } from "./api-client";
import type { Role, SuccessResponse } from "./types";

export const rolesService = {
  async getAll(): Promise<{ success: boolean; roles: Role[] }> {
    return api.get("/role");
  },

  async assign(userId: string, roleId: string): Promise<SuccessResponse> {
    return api.post("/role/assign", { body: { userId, roleId } });
  },

  async remove(userId: string, roleId: string): Promise<SuccessResponse> {
    return api.post("/role/remove", { body: { userId, roleId } });
  },
};
