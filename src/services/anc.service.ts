import { api } from "./api-client";
import type {
  ANCRecord,
  CreateANCRequest,
  UpdateANCRequest,
  SuccessResponse,
} from "./types";

function extractArray(res: Record<string, unknown>): ANCRecord[] {
  return (res.data ?? res.records ?? []) as ANCRecord[];
}

function extractOne(res: Record<string, unknown>): ANCRecord {
  return (res.data ?? res.record ?? res) as ANCRecord;
}

export const ancService = {
  async create(data: CreateANCRequest): Promise<{ success: boolean; record: ANCRecord }> {
    const raw = await api.post<Record<string, unknown>>("/anc", { body: data });
    return { success: true, record: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; record: ANCRecord }> {
    const raw = await api.get<Record<string, unknown>>(`/anc/${id}`);
    return { success: true, record: extractOne(raw) };
  },

  async update(id: string, data: UpdateANCRequest): Promise<{ success: boolean; record: ANCRecord }> {
    const raw = await api.patch<Record<string, unknown>>(`/anc/${id}`, { body: data });
    return { success: true, record: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/anc/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; records: ANCRecord[] }> {
    const raw = await api.get<Record<string, unknown>>(`/anc/patient/${patientId}`);
    return { success: true, records: extractArray(raw) };
  },
};
