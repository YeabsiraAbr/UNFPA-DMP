import { api } from "./api-client";
import type { GBVReport, SuccessResponse } from "./types";

function extractArray(res: Record<string, unknown>): GBVReport[] {
  return (res.data ?? res.reports ?? []) as GBVReport[];
}

function extractOne(res: Record<string, unknown>): GBVReport {
  return (res.data ?? res.report ?? res) as GBVReport;
}

export const gbvReportService = {
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

    const raw = await api.post<Record<string, unknown>>("/gbv", { formData: fd });
    return { success: true, report: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; report: GBVReport }> {
    const raw = await api.get<Record<string, unknown>>(`/gbv/${id}`);
    return { success: true, report: extractOne(raw) };
  },

  async update(id: string, data: Partial<{
    incidentDate: string;
    referral: boolean;
    referralInfo: string;
    highRisk: boolean;
  }>): Promise<{ success: boolean; report: GBVReport }> {
    const raw = await api.patch<Record<string, unknown>>(`/gbv/${id}`, { body: data });
    return { success: true, report: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/gbv/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; reports: GBVReport[] }> {
    const raw = await api.get<Record<string, unknown>>(`/gbv/patient/${patientId}`);
    return { success: true, reports: extractArray(raw) };
  },
};
