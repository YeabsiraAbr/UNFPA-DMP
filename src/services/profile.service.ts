import { api } from "./api-client";
import type { Profile, UpdateProfileRequest, SuccessResponse } from "./types";

export const profileService = {
  async getMe(): Promise<{ success: boolean; profile: Profile }> {
    return api.get("/profile/me");
  },

  async updateMe(data: UpdateProfileRequest): Promise<{ success: boolean; profile: Profile }> {
    return api.patch("/profile/me", { body: data });
  },

  async getSyncStatus(): Promise<{ success: boolean; data: unknown }> {
    return api.get("/profile/sync-status");
  },

  async getHelp(): Promise<{ success: boolean; data: unknown }> {
    return api.get("/profile/help");
  },
};
