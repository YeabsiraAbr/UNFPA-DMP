import { api } from "./api-client";
import type {
  ANCRecord,
  CreateANCRequest,
  UpdateANCRequest,
  SuccessResponse,
} from "./types";

export const ancService = {
  async create(data: CreateANCRequest): Promise<{ success: boolean; record: ANCRecord }> {
    return api.post("/anc", { body: data });
  },

  async getById(id: string): Promise<{ success: boolean; record: ANCRecord }> {
    return api.get(`/anc/${id}`);
  },

  async update(id: string, data: UpdateANCRequest): Promise<{ success: boolean; record: ANCRecord }> {
    return api.patch(`/anc/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/anc/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; records: ANCRecord[] }> {
    return api.get(`/anc/patient/${patientId}`);
  },
};
