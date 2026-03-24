import { api } from "./api-client";
import type {
  PNCVisit,
  CreatePNCRequest,
  UpdatePNCRequest,
  SuccessResponse,
} from "./types";

export const pncService = {
  async create(data: CreatePNCRequest): Promise<{ success: boolean; visit: PNCVisit }> {
    return api.post("/pnc", { body: data });
  },

  async getById(id: string): Promise<{ success: boolean; visit: PNCVisit }> {
    return api.get(`/pnc/${id}`);
  },

  async update(id: string, data: UpdatePNCRequest): Promise<{ success: boolean; visit: PNCVisit }> {
    return api.patch(`/pnc/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/pnc/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; visits: PNCVisit[] }> {
    return api.get(`/pnc/patient/${patientId}`);
  },

  async getByDelivery(deliveryId: string): Promise<{ success: boolean; visits: PNCVisit[] }> {
    return api.get(`/pnc/delivery/${deliveryId}`);
  },
};
