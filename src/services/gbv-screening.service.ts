import { api } from "./api-client";
import type {
  GBVScreening,
  CreateGBVScreeningRequest,
  UpdateGBVScreeningRequest,
  SuccessResponse,
} from "./types";

export const gbvScreeningService = {
  async create(data: CreateGBVScreeningRequest): Promise<{ success: boolean; screening: GBVScreening }> {
    return api.post("/gbv-screening", { body: data });
  },

  async getById(id: string): Promise<{ success: boolean; screening: GBVScreening }> {
    return api.get(`/gbv-screening/${id}`);
  },

  async update(id: string, data: UpdateGBVScreeningRequest): Promise<{ success: boolean; screening: GBVScreening }> {
    return api.patch(`/gbv-screening/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/gbv-screening/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; screenings: GBVScreening[] }> {
    return api.get(`/gbv-screening/patient/${patientId}`);
  },

  async getByReport(gbvReportId: string): Promise<{ success: boolean; screenings: GBVScreening[] }> {
    return api.get(`/gbv-screening/gbv-report/${gbvReportId}`);
  },
};
