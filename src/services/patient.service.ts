import { api } from "./api-client";
import type {
  Patient,
  CreatePatientRequest,
  UpdatePatientRequest,
  RegisterClientRequest,
  SuccessResponse,
} from "./types";

export const patientService = {
  async getAll(): Promise<{ success: boolean; patients: Patient[] }> {
    return api.get("/patient");
  },

  async getById(id: string): Promise<{ success: boolean; patient: Patient }> {
    return api.get(`/patient/${id}`);
  },

  async create(data: CreatePatientRequest): Promise<{ success: boolean; patient: Patient }> {
    return api.post("/patient", { body: data });
  },

  async update(id: string, data: UpdatePatientRequest): Promise<{ success: boolean; patient: Patient }> {
    return api.patch(`/patient/${id}`, { body: data });
  },

  async delete(id: string): Promise<SuccessResponse> {
    return api.delete(`/patient/${id}`);
  },

  async registerClient(data: RegisterClientRequest): Promise<SuccessResponse> {
    return api.post("/patient/register-client", { body: data });
  },
};
