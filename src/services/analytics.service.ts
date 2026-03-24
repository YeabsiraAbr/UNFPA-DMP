import { api } from "./api-client";
import type { DashboardStats, HighRiskPatient } from "./types";

export const analyticsService = {
  async getDashboard(): Promise<{ success: boolean; data: DashboardStats }> {
    return api.get("/analytics/dashboard");
  },

  async getTodaysAppointments(): Promise<{
    success: boolean;
    count: number;
    appointments: unknown[];
  }> {
    return api.get("/analytics/appointments/today");
  },

  async getHighRiskPatients(): Promise<{
    success: boolean;
    count: number;
    patients: HighRiskPatient[];
  }> {
    return api.get("/analytics/high-risk");
  },
};
