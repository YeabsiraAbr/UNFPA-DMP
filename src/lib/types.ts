// User and Role Types
export type UserRole =
  | "midwife"
  | "nurse"
  | "doctor"
  | "specialist"
  | "admin"
  | "health_authority"
  | "partner_analyst"
  | "gbv_officer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  clinic?: string;
  lastActive: string;
  status: "online" | "offline" | "away";
}

// Patient Types
export interface Patient {
  id: string;
  fullName: string;
  age: number;
  dateOfBirth: string;
  idNumber: string;
  phoneNumber?: string;
  address: string;
  village: string;
  emergencyContact: string;
  emergencyPhone: string;
  pregnancyStatus: "pregnant" | "postpartum" | "not_pregnant";
  gravida: number;
  para: number;
  lmpDate?: string;
  eddDate?: string;
  bloodType?: string;
  hivStatus?: "positive" | "negative" | "unknown";
  riskLevel: "low" | "medium" | "high" | "critical";
  riskScore: number;
  riskFactors: string[];
  registeredAt: string;
  lastVisit?: string;
  assignedMidwife: string;
  syncStatus: "synced" | "pending" | "conflict";
  clinicId: string;
}

// Prenatal Visit Types
export interface PrenatalVisit {
  id: string;
  patientId: string;
  visitDate: string;
  visitNumber: number;
  gestationalAge: { weeks: number; days: number };
  vitals: {
    bloodPressureSystolic: number;
    bloodPressureDiastolic: number;
    weight: number;
    temperature: number;
    pulse: number;
    respiratoryRate: number;
    fetalHeartRate?: number;
    fundalHeight?: number;
  };
  symptoms: string[];
  medications: string[];
  labResults?: {
    hemoglobin?: number;
    urinalysis?: string;
    glucoseLevel?: number;
  };
  notes: string;
  nextAppointment?: string;
  riskFlags: string[];
  conductedBy: string;
  syncStatus: "synced" | "pending" | "conflict";
}

// Ultrasound Types
export interface UltrasoundImage {
  id: string;
  patientId: string;
  visitId?: string;
  captureDate: string;
  imageUrl: string;
  thumbnailUrl: string;
  gestationalAge: { weeks: number; days: number };
  findings: string;
  annotations: string[];
  measurements?: {
    bpd?: number; // Biparietal Diameter
    fl?: number; // Femur Length
    ac?: number; // Abdominal Circumference
    hc?: number; // Head Circumference
    efw?: number; // Estimated Fetal Weight
  };
  quality: "excellent" | "good" | "fair" | "poor";
  capturedBy: string;
  reviewedBy?: string;
  reviewStatus: "pending" | "reviewed" | "flagged";
  syncStatus: "synced" | "pending" | "conflict";
}

// GBV Report Types
export interface GBVReport {
  id: string;
  patientId: string;
  reportDate: string;
  incidentDate?: string;
  incidentType: "physical" | "sexual" | "emotional" | "economic" | "other";
  description: string;
  perpetratorRelation?: string;
  injuries?: string;
  safetyPlan: string;
  referrals: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  status: "open" | "in_progress" | "referred" | "closed";
  confidentialityLevel: "standard" | "high" | "restricted";
  reportedBy: string;
  attachments: string[];
  syncStatus: "synced" | "pending" | "conflict";
}

// Teleconsult Types
export interface TeleconsultRequest {
  id: string;
  patientId: string;
  patientName: string;
  requestedBy: string;
  requestDate: string;
  priority: "routine" | "urgent" | "emergency";
  consultationType:
    | "general"
    | "high_risk"
    | "ultrasound_review"
    | "gbv"
    | "complication";
  chiefComplaint: string;
  clinicalNotes: string;
  attachments: {
    type: "visit_notes" | "ultrasound" | "lab_results" | "other";
    url: string;
    name: string;
  }[];
  assignedSpecialist?: string;
  status: "pending" | "assigned" | "in_review" | "responded" | "closed";
  response?: {
    respondedBy: string;
    respondedAt: string;
    diagnosis?: string;
    recommendations: string;
    followUpInstructions: string;
    prescriptions?: string[];
  };
  syncStatus: "synced" | "pending" | "conflict";
}

// Alert Types
export interface Alert {
  id: string;
  type: "appointment" | "risk" | "teleconsult" | "sync" | "system" | "gbv";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  patientId?: string;
  patientName?: string;
  createdAt: string;
  readAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  actionRequired: boolean;
  actionUrl?: string;
}

// Analytics Types
export interface ClinicStats {
  totalPatients: number;
  activePregnancies: number;
  highRiskPatients: number;
  visitsThisMonth: number;
  teleconsultsThisMonth: number;
  gbvReportsThisMonth: number;
  syncPendingCount: number;
  appointmentsToday: number;
}

export interface AnalyticsData {
  visitsByMonth: { month: string; visits: number; newPatients: number }[];
  riskDistribution: { level: string; count: number }[];
  topRiskFactors: { factor: string; count: number }[];
  teleconsultMetrics: {
    totalRequests: number;
    avgResponseTime: number;
    pendingCount: number;
    resolvedCount: number;
  };
  gestationalAgeDistribution: { range: string; count: number }[];
}

// Sync Types
export interface SyncStatus {
  lastSyncTime: string;
  pendingUploads: number;
  pendingDownloads: number;
  conflicts: number;
  isOnline: boolean;
  syncProgress?: number;
  lastError?: string;
}

// Clinic Types
export interface Clinic {
  id: string;
  name: string;
  location: string;
  region: string;
  zone: string;
  woreda: string;
  type: "fixed" | "mobile";
  status: "active" | "inactive";
  staff: string[];
  patientCount: number;
  lastSync: string;
}



