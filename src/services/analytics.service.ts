import { api } from "./api-client";
import type { DashboardStats, HighRiskPatient } from "./types";

export const analyticsService = {
  async getDashboard(): Promise<{ success: boolean; data: DashboardStats }> {
    const raw = await api.get<Record<string, unknown>>("/analytics/dashboard");
    const stats = (raw.data ?? raw) as DashboardStats;
    return { success: true, data: stats };
  },

  async getTodaysAppointments(): Promise<{
    success: boolean;
    count: number;
    appointments: unknown[];
  }> {
    const raw = await api.get<Record<string, unknown>>("/analytics/appointments/today");
    const appointments = (raw.data ?? raw.appointments ?? []) as unknown[];
    return { success: true, count: (raw.count as number) ?? appointments.length, appointments };
  },

  async getHighRiskPatients(): Promise<{
    success: boolean;
    count: number;
    patients: HighRiskPatient[];
  }> {
    const raw = await api.get<Record<string, unknown>>("/analytics/high-risk");
    const patients = (raw.data ?? raw.patients ?? []) as HighRiskPatient[];
    return { success: true, count: (raw.count as number) ?? patients.length, patients };
  },
};
