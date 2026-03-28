// ============================================================================
// API response & entity types – derived from the OpenAPI spec
// ============================================================================

// ---------------------------------------------------------------------------
// Generic wrappers
// ---------------------------------------------------------------------------

export interface SuccessResponse {
  success: boolean;
  message?: string;
}

export interface ListResponse<T> extends SuccessResponse {
  count?: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  fullName: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface FirstTimeChangePasswordRequest {
  phone: string;
  initialPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  phone: string;
}

export interface ResetPasswordRequest {
  phone: string;
  otpCode: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  phone: string;
  fullName: string | null;
  isActive: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Patient
// ---------------------------------------------------------------------------

export interface Patient {
  id: string;
  fullName: string;
  age: number | null;
  dateOfBirth: string;
  idNumber: string;
  phoneNumber?: string | null;
  address: string;
  village: string;
  emergencyContact: string;
  emergencyPhone: string;
  pregnancyStatus: string;
  gravida: number;
  para: number;
  riskLevel: string;
  riskScore: number;
  riskFactors: string[];
  registeredAt: string;
  assignedMidwife: string;
  assignedMidwifeId?: string;
  syncStatus: string;
  clinicId: string;
  clinicName?: string;
  [key: string]: unknown;
}

export interface CreatePatientRequest {
  fullName: string;
  age?: number;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  village?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  pregnancyStatus?: string;
  gravida?: number;
  para?: number;
  riskLevel?: string;
  idNumber?: string;
}

export type UpdatePatientRequest = Partial<CreatePatientRequest>;

export interface RegisterClientRequest extends CreatePatientRequest {
  clientConsentSignature?: string;
  healthProfessionalConsentSignature?: string;
  lmp?: string;
  edd?: string;
  gravida?: number;
  para?: number;
  abortion?: number;
  ectopicPreg?: number;
  childrenAlive?: number;
  pastObstetricHistory?: {
    year?: string;
    ga?: string;
    modeOfDelivery?: string;
    sex?: string;
    birthWeightKg?: number;
  }[];
  diabetesMellitus?: boolean;
  diabetesMellitusMoreInfo?: string;
  cardiacDisease?: boolean;
  cardiacDiseaseMoreInfo?: string;
  chronicHypertension?: boolean;
  chronicHypertensionMoreInfo?: string;
  otherMedicalCondition?: boolean;
  otherMedicalConditionText?: string;
  vdrl?: string;
  hiv?: string;
  hbsAg?: string;
  rbs?: string;
  fbs?: string;
  bloodGroupRh?: string;
  ua?: string;
  td?: string;
  generalExamGeneral?: string;
  generalExamPallor?: string;
  jaundice?: boolean;
  chestAbnormality?: boolean;
  chestAbnormalityMoreInfo?: string;
  heartAbnormality?: boolean;
  heartAbnormalityMoreInfo?: string;
  vulvarUlcer?: boolean;
  vaginalDischarge?: boolean;
  pelvicMass?: boolean;
  cervicalLesion?: boolean;
  uterineSizeWks?: number;
  dangerSignsAdvised?: boolean;
  birthPreparednessAdvised?: boolean;
  motherHivTestAccepted?: boolean;
  hivTestResult?: string;
  hivTestResultReceived?: boolean;
  counseledInfantFeeding?: boolean;
  referredForCare?: boolean;
  partnerHivTestResult?: string;
  gaLmp?: string;
  complaints?: string;
  bloodPressure?: string;
  weightKg?: number;
  pallor?: string;
  hemoglobin?: string;
  uterineHeightWks?: number;
  presentation?: string;
  descent?: string;
  fetalHeartRate?: string;
  remarks?: string;
  nextFollowUpDate?: string;
  dangerSignsIdentified?: string;
  actionAdviceCounselling?: string;
}

// ---------------------------------------------------------------------------
// ANC
// ---------------------------------------------------------------------------

export interface ANCRecord {
  id: string;
  patientId: string;
  lmp: string | null;
  edd: string | null;
  gravida: number | null;
  para: number | null;
  diabetesMellitus: boolean | null;
  hiv: string | null;
  bloodGroupRh: string | null;
  [key: string]: unknown;
}

export interface CreateANCRequest {
  patientId: string;
  lmp?: string;
  edd?: string;
  gravida?: number;
  para?: number;
  diabetesMellitus?: boolean;
  hiv?: string;
  bloodGroupRh?: string;
}

export type UpdateANCRequest = Partial<Omit<CreateANCRequest, "patientId">>;

// ---------------------------------------------------------------------------
// Visit
// ---------------------------------------------------------------------------

export interface Visit {
  id: string;
  patientId: string;
  visitDate: string;
  bloodPressure: string | null;
  temperature: number | null;
  weight: number | null;
  [key: string]: unknown;
}

export interface CreateVisitRequest {
  patientId: string;
  visitDate: string;
  bloodPressure?: string;
  temperature?: number;
  weight?: number;
}

export type UpdateVisitRequest = Partial<Omit<CreateVisitRequest, "patientId">>;

// ---------------------------------------------------------------------------
// Delivery & Newborn
// ---------------------------------------------------------------------------

export interface Newborn {
  id: string;
  quantity: "Single" | "Multiple" | null;
  sex: "Male" | "Female" | null;
  termStatus: "Term" | "Preterm" | null;
  alive: boolean | null;
  apgarScore: number | null;
  sb?: string | null;
  birthWeightGm: number | null;
  lengthCm: number | null;
  vitK?: boolean;
  ttc?: boolean;
  babyMotherBonding?: boolean;
}

export interface Delivery {
  id: string;
  patientId: string;
  pregnancyId?: string;
  deliveryDate: string | null;
  amtsl: "Ergometrine" | "Oxytocin" | "Misoprostol" | null;
  placenta: "Completed" | "Incomplete" | "CCT" | "MRP" | "NRP" | null;
  newborns: Newborn[];
  [key: string]: unknown;
}

export interface CreateDeliveryRequest {
  patientId: string;
  pregnancyId?: string;
  clientConsentSignature?: string;
  healthProfessionalConsentSignature?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  referral?: boolean;
  referralInfo?: string;
  amtsl?: "Ergometrine" | "Oxytocin" | "Misoprostol";
  placenta?: "Completed" | "Incomplete" | "CCT" | "MRP" | "NRP";
  laceration?: "1st Degree" | "2nd Degree" | "3rd Degree";
  obstetricCxManaged?: boolean;
  aphManaged?: boolean;
  rupturedUx?: boolean;
  eclampsiaManaged?: boolean;
  pphManaged?: boolean;
  promSepsisManaged?: boolean;
  obstPrologLaborManaged?: boolean;
  deliveryAssistanceMeasures?: string;
  deliveryAssistanceMore?: string;
  hivCounsTestingOffered?: string;
  hivTestingAccepted?: string;
  hivTestResult?: string;
  arvpxForMothers?: string;
  arvpxForNb?: string;
  feedingOptionEbf?: string;
  rf?: string;
  newborns?: Omit<Newborn, "id">[];
}

export type UpdateDeliveryRequest = Partial<Omit<CreateDeliveryRequest, "patientId">>;

// ---------------------------------------------------------------------------
// PNC
// ---------------------------------------------------------------------------

export interface PNCVisit {
  id: string;
  patientId: string;
  deliveryId: string | null;
  bloodPressure: string | null;
  temperature: number | null;
  babyBreathing: string | null;
  babyBreastFeeding: string | null;
  hivTested: string | null;
  [key: string]: unknown;
}

export interface CreatePNCRequest {
  patientId: string;
  deliveryId?: string;
  clientConsentSignature?: string;
  healthProfessionalConsentSignature?: string;
  visitDate?: string;
  bloodPressure?: string;
  tpr?: string;
  temperature?: number;
  uterusContracted?: string;
  dribblingLeakingUrine?: string;
  anemia?: string;
  vaginalDischarge?: string;
  breast?: string;
  vitaminA?: string;
  counselingDangerSigns?: string;
  babyBreathing?: string;
  babyBreastFeeding?: string;
  babyWeightGm?: number;
  immunization?: string;
  hivTested?: string;
  hivTestResult?: string;
  arvPxForMother?: string;
  arvPxForNewborn?: string;
  feedingOption?: string;
  motherReferredToCare?: string;
  newbornReferredToCare?: string;
  fpCounseledAndProvided?: string;
  remark?: string;
  actionTaken?: string;
}

export type UpdatePNCRequest = Partial<Omit<CreatePNCRequest, "patientId">>;

// ---------------------------------------------------------------------------
// GBV Report
// ---------------------------------------------------------------------------

export interface GBVReport {
  id: string;
  patientId: string;
  incidentDate: string | null;
  referral: boolean | null;
  referralInfo: string | null;
  highRisk: boolean | null;
  attachment: string | null;
  [key: string]: unknown;
}

// For GBV report we use FormData since it supports file upload

// ---------------------------------------------------------------------------
// GBV Screening
// ---------------------------------------------------------------------------

export interface GBVScreening {
  id: string;
  patientId: string;
  gbvReportId?: string;
  gbvHistory: string | null;
  temperature: string | null;
  weightKg: number | null;
  heightCm: number | null;
  bmiIndex: number | null;
  workingDiagnosis: string | null;
  treatmentPlan: string | null;
  [key: string]: unknown;
}

export interface CreateGBVScreeningRequest {
  patientId: string;
  gbvReportId?: string;
  survivorConsentSignature?: string;
  caseWorkerConsentSignature?: string;
  gbvHistory?: string;
  temperature?: string;
  weightKg?: number;
  heightCm?: number;
  bmiIndex?: number;
  bloodPressure?: string;
  pulse?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  physicalExamination?: string;
  workingDiagnosis?: string;
  laboratoryResults?: string;
  pregnancyTestingResults?: string;
  hivTestingResults?: string;
  stiTestingResults?: string;
  postExposureProphylaxisTreatment?: string;
  emergencyContraceptiveProvision?: string;
  typeOfUltrasound?: string;
  ultrasoundMore?: string;
  smartUltrasoundRecommendation?: string;
  treatmentPlan?: string;
  treatmentRx?: string;
  continuationSheet?: string;
}

export type UpdateGBVScreeningRequest = Partial<Omit<CreateGBVScreeningRequest, "patientId">>;

// ---------------------------------------------------------------------------
// SRH
// ---------------------------------------------------------------------------

export interface SRHRegistration {
  id: string;
  patientId: string;
  history: string | null;
  temperature: string | null;
  weightKg: number | null;
  heightCm: number | null;
  bmiIndex: number | null;
  workingDiagnosis: string | null;
  treatmentPlan: string | null;
  [key: string]: unknown;
}

export interface CreateSRHRequest {
  patientId: string;
  clientConsentSignature?: string;
  healthProfessionalConsentSignature?: string;
  srhServiceType?: string;
  history?: string;
  temperature?: string;
  weightKg?: number;
  heightCm?: number;
  bmiIndex?: number;
  bloodPressure?: string;
  pulse?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  physicalExamination?: string;
  workingDiagnosis?: string;
  laboratoryResults?: string;
  typeOfUltrasound?: string;
  ultrasoundMore?: string;
  smartUltrasoundRecommendation?: string;
  treatmentPlan?: string;
  treatmentRx?: string;
  continuationSheet?: string;
}

export type UpdateSRHRequest = Partial<Omit<CreateSRHRequest, "patientId">>;

// ---------------------------------------------------------------------------
// Ultrasound
// ---------------------------------------------------------------------------

export interface UltrasoundScan {
  id: string;
  patientId: string;
  visitId: string | null;
  imageUrl: string;
  description: string | null;
  gestationalAge: number | null;
  [key: string]: unknown;
}

// Upload uses FormData

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export interface DashboardStats {
  totalPatients: number;
  activePregnancies: number;
  highRiskCount: number;
  appointmentsToday: number;
  totalVisits: number;
  upcomingAppointments: number;
  patientsWithReferrals: number;
  totalDeliveries: number;
  totalPNCVisits: number;
  totalGBVCases: number;
  patientsThisMonth: number;
  visitsThisMonth: number;
}

export interface HighRiskPatient {
  patient: Patient;
  riskFactors: string[];
}

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export interface Conversation {
  id: string;
  [key: string]: unknown;
}

export interface Message {
  id: string;
  body: string;
  attachmentUrl?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  fullName: string | null;
  phone: string;
  displayId?: string;
  profileImageUrl?: string;
  preferredLanguage?: "EN" | "SO";
  [key: string]: unknown;
}

export interface UpdateProfileRequest {
  fullName?: string;
  displayId?: string;
  profileImageUrl?: string;
  preferredLanguage?: "EN" | "SO";
}

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------

export interface Role {
  id: string;
  name: string;
  [key: string]: unknown;
}
