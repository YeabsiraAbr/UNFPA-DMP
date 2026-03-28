import { api } from "./api-client";
import type {
  GBVScreening,
  CreateGBVScreeningRequest,
  UpdateGBVScreeningRequest,
  SuccessResponse,
} from "./types";

function extractArray(res: Record<string, unknown>): GBVScreening[] {
  return (res.data ?? res.screenings ?? []) as GBVScreening[];
}

function extractOne(res: Record<string, unknown>): GBVScreening {
  return (res.data ?? res.screening ?? res) as GBVScreening;
}

export const gbvScreeningService = {
  async create(data: CreateGBVScreeningRequest): Promise<{ success: boolean; screening: GBVScreening }> {
    const raw = await api.post<Record<string, unknown>>("/gbv-screening", { body: data });
    return { success: true, screening: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; screening: GBVScreening }> {
    const raw = await api.get<Record<string, unknown>>(`/gbv-screening/${id}`);
    return { success: true, screening: extractOne(raw) };
  },

  async update(id: string, data: UpdateGBVScreeningRequest): Promise<{ success: boolean; screening: GBVScreening }> {
    const raw = await api.patch<Record<string, unknown>>(`/gbv-screening/${id}`, { body: data });
    return { success: true, screening: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/gbv-screening/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; screenings: GBVScreening[] }> {
    const raw = await api.get<Record<string, unknown>>(`/gbv-screening/patient/${patientId}`);
    return { success: true, screenings: extractArray(raw) };
  },

  async getByReport(gbvReportId: string): Promise<{ success: boolean; screenings: GBVScreening[] }> {
    const raw = await api.get<Record<string, unknown>>(`/gbv-screening/gbv-report/${gbvReportId}`);
    return { success: true, screenings: extractArray(raw) };
  },
};
