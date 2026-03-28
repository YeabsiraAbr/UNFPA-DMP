import { cached } from "./cache";
import { patientService } from "./patient.service";
import type { Patient } from "./types";

/**
 * Returns the patient list from cache (1-min TTL) so every page
 * that needs patient IDs or names doesn't re-fetch from the API.
 */
export async function getCachedPatients(): Promise<Patient[]> {
  const res = await cached("patients-list", () => patientService.getAll());
  return res.success && res.patients ? res.patients : [];
}
