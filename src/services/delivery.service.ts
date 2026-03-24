import { api } from "./api-client";
import type {
  Delivery,
  CreateDeliveryRequest,
  UpdateDeliveryRequest,
  SuccessResponse,
} from "./types";

export const deliveryService = {
  async create(data: CreateDeliveryRequest): Promise<{ success: boolean; delivery: Delivery }> {
    return api.post("/delivery", { body: data });
  },

  async getById(id: string): Promise<{ success: boolean; delivery: Delivery }> {
    return api.get(`/delivery/${id}`);
  },

  async update(id: string, data: UpdateDeliveryRequest): Promise<{ success: boolean; delivery: Delivery }> {
    return api.patch(`/delivery/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/delivery/${id}`);
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; deliveries: Delivery[] }> {
    return api.get(`/delivery/patient/${patientId}`);
  },

  async getByPregnancy(pregnancyId: string): Promise<{ success: boolean; deliveries: Delivery[] }> {
    return api.get(`/delivery/pregnancy/${pregnancyId}`);
  },
};
