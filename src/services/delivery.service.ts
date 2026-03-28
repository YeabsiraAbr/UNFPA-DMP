import { api } from "./api-client";
import type {
  Delivery,
  CreateDeliveryRequest,
  UpdateDeliveryRequest,
  SuccessResponse,
} from "./types";

function extractArray(res: Record<string, unknown>): Delivery[] {
  return (res.data ?? res.deliveries ?? []) as Delivery[];
}

function extractOne(res: Record<string, unknown>): Delivery {
  return (res.data ?? res.delivery ?? res) as Delivery;
}

export const deliveryService = {
  async create(data: CreateDeliveryRequest): Promise<{ success: boolean; delivery: Delivery }> {
    const raw = await api.post<Record<string, unknown>>("/delivery", { body: data });
    return { success: true, delivery: extractOne(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; delivery: Delivery }> {
    const raw = await api.get<Record<string, unknown>>(`/delivery/${id}`);
    return { success: true, delivery: extractOne(raw) };
  },

  async update(id: string, data: UpdateDeliveryRequest): Promise<{ success: boolean; delivery: Delivery }> {
    const raw = await api.patch<Record<string, unknown>>(`/delivery/${id}`, { body: data });
    return { success: true, delivery: extractOne(raw) };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/delivery/${id}`);
    return { success: true };
  },

  async getByPatient(patientId: string): Promise<{ success: boolean; deliveries: Delivery[] }> {
    const raw = await api.get<Record<string, unknown>>(`/delivery/patient/${patientId}`);
    return { success: true, deliveries: extractArray(raw) };
  },

  async getByPregnancy(pregnancyId: string): Promise<{ success: boolean; deliveries: Delivery[] }> {
    const raw = await api.get<Record<string, unknown>>(`/delivery/pregnancy/${pregnancyId}`);
    return { success: true, deliveries: extractArray(raw) };
  },
};
