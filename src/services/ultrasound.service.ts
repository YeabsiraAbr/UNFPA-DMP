import { api } from "./api-client";
import type { UltrasoundScan, SuccessResponse } from "./types";

function extractArray(res: Record<string, unknown>): UltrasoundScan[] {
  return (res.data ?? res.scans ?? res.ultrasounds ?? []) as UltrasoundScan[];
}

const BASE = "/ultrasounds";

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

    const raw = await api.post<Record<string, unknown>>(BASE, { formData: fd });
    return { success: true, scan: extractOne(raw) };
  },

  /** Detail requires `patientId` as a query parameter on the API. */
  async getById(
    id: string,
    patientId: string
  ): Promise<{ success: boolean; scan: UltrasoundScan }> {
    const raw = await api.get<Record<string, unknown>>(`${BASE}/${id}`, {
      params: { patientId },
    });
    return { success: true, scan: extractOne(raw) };
  },

  async update(id: string, data: Partial<{
    description: string;
    gestationalAge: number;
  }>): Promise<{ success: boolean; scan: UltrasoundScan }> {
    const raw = await api.patch<Record<string, unknown>>(`${BASE}/${id}`, { body: data });
    return { success: true, scan: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`${BASE}/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; scans: UltrasoundScan[] }> {
    const raw = await api.get<Record<string, unknown>>(BASE, {
      params: { patientId },
    });
    return { success: true, scans: extractArray(raw) };
  },
};
