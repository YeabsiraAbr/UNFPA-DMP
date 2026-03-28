import { api } from "./api-client";
import type { Profile, UpdateProfileRequest, SuccessResponse } from "./types";

export const profileService = {
  async getMe(): Promise<{ success: boolean; profile: Profile }> {
    const raw = await api.get<Record<string, unknown>>("/profile/me");
    const profile = (raw.data ?? raw.profile ?? raw) as Profile;
    return { success: true, profile };
  },

  async updateMe(data: UpdateProfileRequest): Promise<{ success: boolean; profile: Profile }> {
    const raw = await api.patch<Record<string, unknown>>("/profile/me", { body: data });
    const profile = (raw.data ?? raw.profile ?? raw) as Profile;
    return { success: true, profile };
  },

  async getSyncStatus(): Promise<{ success: boolean; data: unknown }> {
    const raw = await api.get<Record<string, unknown>>("/profile/sync-status");
    return { success: true, data: raw.data ?? raw };
  },

  async getHelp(): Promise<{ success: boolean; data: unknown }> {
    const raw = await api.get<Record<string, unknown>>("/profile/help");
    return { success: true, data: raw.data ?? raw };
  },
};
