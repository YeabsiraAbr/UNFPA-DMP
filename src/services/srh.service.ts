import { api } from "./api-client";
import type {
  SRHRegistration,
  CreateSRHRequest,
  UpdateSRHRequest,
  SuccessResponse,
} from "./types";

function extractArray(res: Record<string, unknown>): SRHRegistration[] {
  return (res.data ?? res.registrations ?? []) as SRHRegistration[];
}

function extractOne(res: Record<string, unknown>): SRHRegistration {
  return (res.data ?? res.registration ?? res) as SRHRegistration;
}

export const srhService = {
  async create(data: CreateSRHRequest): Promise<{ success: boolean; registration: SRHRegistration }> {
    const raw = await api.post<Record<string, unknown>>("/srh", { body: data });
    return { success: true, registration: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; registration: SRHRegistration }> {
    const raw = await api.get<Record<string, unknown>>(`/srh/${id}`);
    return { success: true, registration: extractOne(raw) };
  },

  async update(id: string, data: UpdateSRHRequest): Promise<{ success: boolean; registration: SRHRegistration }> {
    const raw = await api.patch<Record<string, unknown>>(`/srh/${id}`, { body: data });
    return { success: true, registration: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/srh/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; registrations: SRHRegistration[] }> {
    const raw = await api.get<Record<string, unknown>>(`/srh/patient/${patientId}`);
    return { success: true, registrations: extractArray(raw) };
  },
};
