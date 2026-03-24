import { api } from "./api-client";
import type { UltrasoundScan, SuccessResponse } from "./types";

export const ultrasoundService = {
  /**
   * Upload a new ultrasound scan. Uses FormData for the image.
   */
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

    return api.post("/ultrasound", { formData: fd });
  },

  async getById(id: string): Promise<{ success: boolean; scan: UltrasoundScan }> {
    return api.get(`/ultrasound/${id}`);
  },

  async update(id: string, data: Partial<{
    description: string;
    gestationalAge: number;
  }>): Promise<{ success: boolean; scan: UltrasoundScan }> {
    return api.patch(`/ultrasound/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/ultrasound/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; scans: UltrasoundScan[] }> {
    return api.get(`/ultrasound/patient/${patientId}`);
  },
};
