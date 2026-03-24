import { api } from "./api-client";
import type {
  Visit,
  CreateVisitRequest,
  UpdateVisitRequest,
  SuccessResponse,
} from "./types";

export const visitService = {
  async create(data: CreateVisitRequest): Promise<{ success: boolean; visit: Visit }> {
    return api.post("/visit", { body: data });
  },

  async getById(id: string): Promise<{ success: boolean; visit: Visit }> {
    return api.get(`/visit/${id}`);
  },

  async update(id: string, data: UpdateVisitRequest): Promise<{ success: boolean; visit: Visit }> {
    return api.patch(`/visit/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/visit/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; visits: Visit[] }> {
    return api.get(`/visit/patient/${patientId}`);
  },
};
