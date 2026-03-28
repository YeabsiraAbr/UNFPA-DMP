import { api } from "./api-client";
import type {
  Visit,
  CreateVisitRequest,
  UpdateVisitRequest,
  SuccessResponse,
} from "./types";

/* The real API wraps responses in { data: ... , meta: ... }. These helpers
   normalise into the shape every page already expects. */

function extractArray(res: Record<string, unknown>): Visit[] {
  return (res.data ?? res.visits ?? []) as Visit[];
}

function extractOne(res: Record<string, unknown>): Visit {
  return (res.data ?? res.visit ?? res) as Visit;
}

export const visitService = {
  async create(data: CreateVisitRequest): Promise<{ success: boolean; visit: Visit }> {
    const raw = await api.post<Record<string, unknown>>("/visit", { body: data });
    return { success: true, visit: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; visit: Visit }> {
    const raw = await api.get<Record<string, unknown>>(`/visit/${id}`);
    return { success: true, visit: extractOne(raw) };
  },

  async update(id: string, data: UpdateVisitRequest): Promise<{ success: boolean; visit: Visit }> {
    const raw = await api.patch<Record<string, unknown>>(`/visit/${id}`, { body: data });
    return { success: true, visit: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/visit/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; visits: Visit[] }> {
    const raw = await api.get<Record<string, unknown>>(`/visit/patient/${patientId}`);
    return { success: true, visits: extractArray(raw) };
  },
};
