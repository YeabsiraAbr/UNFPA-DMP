import { api } from "./api-client";
import type {
  SRHRegistration,
  CreateSRHRequest,
  UpdateSRHRequest,
  SuccessResponse,
} from "./types";

export const srhService = {
  async create(data: CreateSRHRequest): Promise<{ success: boolean; registration: SRHRegistration }> {
    return api.post("/srh", { body: data });
  },

  async getById(id: string): Promise<{ success: boolean; registration: SRHRegistration }> {
    return api.get(`/srh/${id}`);
  },

  async update(id: string, data: UpdateSRHRequest): Promise<{ success: boolean; registration: SRHRegistration }> {
    return api.patch(`/srh/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/srh/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; registrations: SRHRegistration[] }> {
    return api.get(`/srh/patient/${patientId}`);
  },
};
