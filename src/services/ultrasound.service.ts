import { api } from "./api-client";
import type { UltrasoundScan, SuccessResponse } from "./types";

function extractArray(res: Record<string, unknown>): UltrasoundScan[] {
  return (res.data ?? res.scans ?? []) as UltrasoundScan[];
}

function extractOne(res: Record<string, unknown>): UltrasoundScan {
  return (res.data ?? res.scan ?? res) as UltrasoundScan;
}

export const ultrasoundService = {
  async create(data: {
    patientId: string;
    visitId?: string;
    image: File;
    description?: string;
    gestationalAge?: number;
  }): Promise<{ success: boolean; scan: UltrasoundScan }> {
    const fd = new FormData();
    fd.append("patientId", data.patientId);
    if (data.visitId) fd.append("visitId", data.visitId);
    fd.append("image", data.image);
    if (data.description) fd.append("description", data.description);
    if (data.gestationalAge !== undefined) fd.append("gestationalAge", String(data.gestationalAge));

    const raw = await api.post<Record<string, unknown>>("/ultrasound", { formData: fd });
    return { success: true, scan: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; scan: UltrasoundScan }> {
    const raw = await api.get<Record<string, unknown>>(`/ultrasound/${id}`);
    return { success: true, scan: extractOne(raw) };
  },

  async update(id: string, data: Partial<{
    description: string;
    gestationalAge: number;
  }>): Promise<{ success: boolean; scan: UltrasoundScan }> {
    const raw = await api.patch<Record<string, unknown>>(`/ultrasound/${id}`, { body: data });
    return { success: true, scan: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/ultrasound/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; scans: UltrasoundScan[] }> {
    const raw = await api.get<Record<string, unknown>>(`/ultrasound/patient/${patientId}`);
    return { success: true, scans: extractArray(raw) };
  },
};
