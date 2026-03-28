import { api } from "./api-client";
import type {
  PNCVisit,
  CreatePNCRequest,
  UpdatePNCRequest,
  SuccessResponse,
} from "./types";

function extractArray(res: Record<string, unknown>): PNCVisit[] {
  return (res.data ?? res.visits ?? []) as PNCVisit[];
}

function extractOne(res: Record<string, unknown>): PNCVisit {
  return (res.data ?? res.visit ?? res) as PNCVisit;
}

export const pncService = {
  async create(data: CreatePNCRequest): Promise<{ success: boolean; visit: PNCVisit }> {
    const raw = await api.post<Record<string, unknown>>("/pnc", { body: data });
    return { success: true, visit: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; visit: PNCVisit }> {
    const raw = await api.get<Record<string, unknown>>(`/pnc/${id}`);
    return { success: true, visit: extractOne(raw) };
  },

  async update(id: string, data: UpdatePNCRequest): Promise<{ success: boolean; visit: PNCVisit }> {
    const raw = await api.patch<Record<string, unknown>>(`/pnc/${id}`, { body: data });
    return { success: true, visit: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/pnc/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; visits: PNCVisit[] }> {
    const raw = await api.get<Record<string, unknown>>(`/pnc/patient/${patientId}`);
    return { success: true, visits: extractArray(raw) };
  },

  async getByDelivery(deliveryId: string): Promise<{ success: boolean; visits: PNCVisit[] }> {
    const raw = await api.get<Record<string, unknown>>(`/pnc/delivery/${deliveryId}`);
    return { success: true, visits: extractArray(raw) };
  },
};
