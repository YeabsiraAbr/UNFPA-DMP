import { api } from "./api-client";
import type { GBVReport, SuccessResponse } from "./types";

export const gbvReportService = {
  /**
   * Create a GBV report. Uses FormData to support file attachment.
   */
  async create(data: {
    patientId: string;
    incidentDate?: string;
    referral?: boolean;
    referralInfo?: string;
    highRisk?: boolean;
    attachment?: File;
  }): Promise<{ success: boolean; report: GBVReport }> {
    const fd = new FormData();
    fd.append("patientId", data.patientId);
    if (data.incidentDate) fd.append("incidentDate", data.incidentDate);
    if (data.referral !== undefined) fd.append("referral", String(data.referral));
    if (data.referralInfo) fd.append("referralInfo", data.referralInfo);
    if (data.highRisk !== undefined) fd.append("highRisk", String(data.highRisk));
    if (data.attachment) fd.append("attachment", data.attachment);

    return api.post("/gbv", { formData: fd });
  },

  async getById(id: string): Promise<{ success: boolean; report: GBVReport }> {
    return api.get(`/gbv/${id}`);
  },

  async update(id: string, data: Partial<{
    incidentDate: string;
    referral: boolean;
    referralInfo: string;
    highRisk: boolean;
  }>): Promise<{ success: boolean; report: GBVReport }> {
    return api.patch(`/gbv/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/gbv/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; reports: GBVReport[] }> {
    return api.get(`/gbv/patient/${patientId}`);
  },
};
