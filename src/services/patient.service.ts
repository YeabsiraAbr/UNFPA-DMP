import { api } from "./api-client";
import type {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
  RegisterClientRequest,
  SuccessResponse,
} from "./types";

function extractArray(res: Record<string, unknown>): Patient[] {
  return (res.data ?? res.patients ?? []) as Patient[];
}

function extractOne(res: Record<string, unknown>): Patient {
  return (res.data ?? res.patient ?? res) as Patient;
}

export const patientService = {
  async getAll(): Promise<{ success: boolean; patients: Patient[] }> {
    const raw = await api.get<Record<string, unknown>>("/patient");
    return { success: true, patients: extractArray(raw) };
  },

  async getById(id: string): Promise<{ success: boolean; patient: Patient }> {
    const raw = await api.get<Record<string, unknown>>(`/patient/${id}`);
    return { success: true, patient: extractOne(raw) };
  },

  async create(data: CreatePatientRequest): Promise<{ success: boolean }> {
    await api.post("/patient", { body: data });
    return { success: true };
  },

  async update(id: string, data: UpdatePatientRequest): Promise<{ success: boolean }> {
    await api.patch(`/patient/${id}`, { body: data });
    return { success: true };
  },

  async delete(id: string): Promise<SuccessResponse> {
    await api.delete(`/patient/${id}`);
    return { success: true };
  },

  async registerClient(data: RegisterClientRequest): Promise<SuccessResponse> {
    await api.post("/patient/register-client", { body: data });
    return { success: true };
  },
};
