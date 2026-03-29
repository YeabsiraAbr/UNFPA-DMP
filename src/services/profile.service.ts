import { api } from "./api-client";
import type { Profile, UpdateProfileRequest, SuccessResponse } from "./types";

/** Unwrap nested API envelopes until we hit an object that looks like a profile row. */
function unwrapProfileNode(input: unknown): Record<string, unknown> {
  let o: unknown = input;
  for (let i = 0; i < 8 && o && typeof o === "object"; i++) {
    const r = o as Record<string, unknown>;
    if (typeof r.id === "string" || typeof r.userId === "string") return r;
    if (typeof r.phone === "string" || r.fullName != null || r.name != null) return r;
    const next = r.data ?? r.profile ?? r.user ?? r.result ?? r.payload;
    if (next && typeof next === "object") o = next;
    else return r;
  }
  return (o && typeof o === "object" ? o : {}) as Record<string, unknown>;
}

function profileFromPayload(o: Record<string, unknown>): Profile {
  const id = String(o.id ?? o.userId ?? "").trim();
  const fullNameRaw = o.fullName ?? o.name;
  const fullName =
    fullNameRaw === undefined || fullNameRaw === null ? null : String(fullNameRaw);
  return {
    id,
    fullName,
    phone: String(o.phone ?? o.phoneNumber ?? ""),
    displayId: o.displayId as string | undefined,
    profileImageUrl: o.profileImageUrl as string | undefined,
    preferredLanguage: o.preferredLanguage as "EN" | "SO" | undefined,
  };
}

export const profileService = {
  async getMe(): Promise<{ success: boolean; profile: Profile }> {
    const raw = await api.get<Record<string, unknown>>("/profile/me");
    const profile = profileFromPayload(unwrapProfileNode(raw));
    return { success: true, profile };
  },

  async updateMe(data: UpdateProfileRequest): Promise<{ success: boolean; profile: Profile }> {
    const raw = await api.patch<Record<string, unknown>>("/profile/me", { body: data });
    const profile = profileFromPayload(unwrapProfileNode(raw));
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
