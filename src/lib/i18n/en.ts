const en = {
  // -------------------------------------------------------------------------
  // Common / Shared
  // -------------------------------------------------------------------------
  common: {
    search: "Search",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    back: "Back",
    next: "Next",
    yes: "Yes",
    no: "No",
    ok: "OK",
    loading: "Loading...",
    noData: "No data available",
    actions: "Actions",
    status: "Status",
    type: "Type",
    date: "Date",
    name: "Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    active: "Active",
    inactive: "Inactive",
    view: "View",
    export: "Export",
    refresh: "Refresh",
    by: "by",
    or: "or",
    to: "to",
    of: "of",
    na: "N/A",
    dash: "-",
    unknown: "Unknown",
    never: "Never",
    years: "years",
    yearsShort: "y",
    yearsOldShort: "yo",
    patients: "patients",
    patient: "Patient",
    more: "more",
    today: "today",
    version: "Version",
    fromLastMonth: "from last month",
    justNow: "Just now",
    mAgo: "m ago",
    hAgo: "h ago",
    dAgo: "d ago",
    minAgo: "min ago",
    system: "System",
  },

  // -------------------------------------------------------------------------
  // Units
  // -------------------------------------------------------------------------
  units: {
    kg: "kg",
    cm: "cm",
    bpm: "bpm",
    mm: "mm",
    g: "g",
    mmHg: "mmHg",
    celsius: "°C",
    percent: "%",
    hours: "h",
    mb: "MB",
    gb: "GB",
  },

  // -------------------------------------------------------------------------
  // Login Page
  // -------------------------------------------------------------------------
  login: {
    brandTitle: "UNFPA DMP",
    brandSubtitle: "Digital Maternity Package Dashboard",
    brandLocation: "Nogob Zone, Ethiopia",
    welcomeBack: "Welcome Back",
    signInDescription: "Sign in to continue to your dashboard",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    signIn: "Sign In",
    demoMode: "Demo Mode",
    demoDescription: "Use any email and password to login",
    validationError: "Please enter both email and password",
    footerVersion: "Digital Maternity Package v1.0",
    footerCopyright: "© 2024 UNFPA • Center of Excellence International Consult",
  },

  // -------------------------------------------------------------------------
  // Sidebar / Navigation
  // -------------------------------------------------------------------------
  nav: {
    dashboard: "Dashboard",
    patients: "Patients",
    prenatalCare: "Prenatal Care",
    ultrasound: "Ultrasound",
    gbvReports: "GBV Reports",
    teleconsult: "Teleconsult",
    alerts: "Alerts",
    analytics: "Analytics",
    aiRisk: "AI Risk",
    syncStatus: "Sync Status",
    clinics: "Clinics",
    settings: "Settings",
    logout: "Logout",
    logoTitle: "UNFPA DMP",
    logoSubtitle: "Maternal Health",
  },

  // -------------------------------------------------------------------------
  // Header
  // -------------------------------------------------------------------------
  header: {
    searchPlaceholder: "Search patients, visits...",
    online: "Online",
    offline: "Offline",
    pending: "pending",
    notifications: "Notifications",
    unreadAlerts: "unread alerts",
    viewAllNotifications: "View all notifications →",
    language: "Language",
  },

  // -------------------------------------------------------------------------
  // Dashboard Page
  // -------------------------------------------------------------------------
  dashboard: {
    title: "Dashboard",
    subtitle: "Digital Maternity Package - Nogob Zone, Ethiopia",
    totalPatients: "Total Patients",
    registeredMothers: "Registered mothers",
    activePregnancies: "Active Pregnancies",
    currentlyMonitored: "Currently being monitored",
    highRisk: "High Risk",
    patientsRequiringAttention: "Patients requiring attention",
    todaysAppointments: "Today's Appointments",
    scheduledVisits: "Scheduled visits",
    visitsThisMonth: "Visits This Month",
    teleconsults: "Teleconsults",
    gbvReports: "GBV Reports",
    thisMonth: "This month",
    pendingSync: "Pending Sync",
    recordsToUpload: "Records to upload",
  },

  // -------------------------------------------------------------------------
  // Quick Actions
  // -------------------------------------------------------------------------
  quickActions: {
    title: "Quick Actions",
    registerPatient: "Register Patient",
    registerPatientDesc: "Add new maternal patient",
    recordVisit: "Record Visit",
    recordVisitDesc: "Log prenatal checkup",
    captureUltrasound: "Capture Ultrasound",
    captureUltrasoundDesc: "Upload scan images",
    requestTeleconsult: "Request Teleconsult",
    requestTeleconsultDesc: "Connect with specialist",
    gbvIntake: "GBV Intake",
    gbvIntakeDesc: "Secure case reporting",
    manualSync: "Manual Sync",
    manualSyncDesc: "Upload pending data",
  },

  // -------------------------------------------------------------------------
  // Recent Activity
  // -------------------------------------------------------------------------
  recentActivity: {
    title: "Recent Activity",
    viewAll: "View all activity →",
    criticalRiskAlert: "Critical risk alert generated",
    emergencyTeleconsult: "Emergency teleconsult request submitted",
    prenatalVisitCompleted: "Prenatal visit completed",
    ultrasoundCaptured: "Ultrasound scan captured",
    recordsSynchronized: "records synchronized from",
    newPatientRegistered: "New patient registered",
    gbvIntakeCompleted: "GBV intake form completed",
    maskedPatientId: "Patient ID:",
  },

  // -------------------------------------------------------------------------
  // Upcoming Appointments
  // -------------------------------------------------------------------------
  upcomingAppointments: {
    title: "Upcoming Appointments",
    routine: "Routine",
    highRisk: "High Risk",
    urgent: "Urgent",
    visit: "Visit",
    prenatalCheckup: "Prenatal Checkup",
    followUpHighRisk: "Follow-up (High Risk)",
    viewFullSchedule: "View full schedule →",
  },

  // -------------------------------------------------------------------------
  // High Risk Patients
  // -------------------------------------------------------------------------
  highRiskPatients: {
    title: "High Risk Patients",
    riskScore: "Risk Score",
    viewAll: "View all high-risk patients",
  },

  // -------------------------------------------------------------------------
  // Charts
  // -------------------------------------------------------------------------
  charts: {
    visitsAndRegistrations: "Visits & New Registrations",
    totalVisits: "Total Visits",
    newPatients: "New Patients",
    riskLevelDistribution: "Risk Level Distribution",
    topRiskFactors: "Top Risk Factors",
    gestationalAgeDistribution: "Gestational Age Distribution",
    teleconsultStatus: "Teleconsult Status",
    totalRequests: "Total Requests",
    avgResponse: "Avg Response",
    pendingLabel: "Pending",
    resolvedLabel: "Resolved",
  },

  // -------------------------------------------------------------------------
  // Patients Page
  // -------------------------------------------------------------------------
  patientsPage: {
    title: "Patient Management",
    subtitle: "Register, view, and manage maternal patient records",
    searchPlaceholder: "Search patients...",
    allRiskLevels: "All Risk Levels",
    lowRisk: "Low Risk",
    mediumRisk: "Medium Risk",
    highRisk: "High Risk",
    critical: "Critical",
    allClinics: "All Clinics",
    newPatient: "New Patient",
    totalPatients: "Total Patients",
    activePregnancies: "Active Pregnancies",
    pendingSync: "Pending Sync",

    // Table headers
    colPatient: "Patient",
    colIdNumber: "ID Number",
    colAge: "Age",
    colStatus: "Status",
    colRiskLevel: "Risk Level",
    colLastVisit: "Last Visit",
    colSync: "Sync",

    // Status badges
    pregnant: "Pregnant",
    postpartum: "Postpartum",
    notPregnant: "Not Pregnant",

    // Tabs
    tabOverview: "Overview",
    tabVisits: "Visits",
    tabRiskAssessment: "Risk Assessment",
    tabHistory: "History",

    // Patient details
    personalInformation: "Personal Information",
    age: "Age:",
    dob: "DOB:",
    phoneLabel: "Phone:",
    address: "Address:",
    obstetricInformation: "Obstetric Information",
    gp: "G/P:",
    bloodType: "Blood Type:",
    lmp: "LMP:",
    edd: "EDD:",
    riskAssessment: "Risk Assessment",
    riskScore: "Risk Score",
    outOf100: "/100",

    // Buttons
    editPatient: "Edit Patient",
    scheduleVisit: "Schedule Visit",
    fullProfile: "Full Profile",

    // Visit details
    visitPrefix: "Visit #",
    bp: "BP",
    weight: "Weight",
    fhr: "FHR",
    fundalHeight: "Fundal Height",
    noVisitsRecorded: "No visits recorded yet",

    // Risk assessment
    overallRiskScore: "Overall Risk Score",
    activeRiskFactors: "Active Risk Factors",
    historyComingSoon: "Patient history timeline coming soon...",
  },

  // -------------------------------------------------------------------------
  // Clinics Page
  // -------------------------------------------------------------------------
  clinicsPage: {
    title: "Clinics",
    subtitle: "Manage mobile health units and fixed facilities",
    totalFacilities: "Total Facilities",
    mobileUnits: "Mobile Units",
    fixedFacilities: "Fixed Facilities",
    totalPatients: "Total Patients",
    searchPlaceholder: "Search clinics...",
    addClinic: "Add Clinic",
    staff: "Staff",
    mobile: "mobile",
    fixed: "fixed",
    locationDetails: "Location Details",
    region: "Region",
    zone: "Zone",
    woreda: "Woreda",
    location: "Location",
    facility: "Facility",
    statistics: "Statistics",
    staffMembers: "Staff Members",
    visitsPerMonth: "Visits/Month",
    lastSynchronized: "Last synchronized:",
    mobileFacility: "Mobile Facility",
    fixedFacility: "Fixed Facility",
    editClinic: "Edit Clinic",
    configure: "Configure",
    deactivate: "Deactivate",
  },

  // -------------------------------------------------------------------------
  // Prenatal Page
  // -------------------------------------------------------------------------
  prenatalPage: {
    title: "Prenatal Care",
    subtitle: "Track prenatal visits, vitals, and patient progress",
    totalVisits: "Total Visits",
    activePregnancies: "Active Pregnancies",
    visitsWithRiskFlags: "Visits with Risk Flags",
    appointmentsToday: "Appointments Today",
    searchPlaceholder: "Search by patient name...",
    allVisits: "All Visits",
    filterToday: "Today",
    filterThisWeek: "This Week",
    filterThisMonth: "This Month",
    newVisit: "New Visit",
    recentPrenatalVisits: "Recent Prenatal Visits",
    vitalsTrend: "Vitals Trend",
    systolicBP: "Systolic BP",
    diastolicBP: "Diastolic BP",
    quickReference: "Quick Reference",
    normalRanges: "Normal Ranges",
    refBP: "BP: 90/60 - 120/80 mmHg",
    refFHR: "FHR: 110-160 bpm",
    refTemp: "Temp: 36.1-37.2°C",
    refFundalHeight: "Fundal height = GA (±2cm)",
    warningSigns: "Warning Signs",
    warnBP: "BP ≥ 140/90 mmHg",
    warnProteinuria: "Proteinuria",
    warnHeadache: "Severe headache",
    warnVisual: "Visual disturbances",
    warnFetalMovement: "Reduced fetal movement",

    // Visit details modal
    visitDetails: "Visit Details",
    conductedBy: "Conducted By",
    vitalSigns: "Vital Signs",
    bloodPressure: "Blood Pressure",
    fhrBpm: "FHR (bpm)",
    weightKg: "Weight (kg)",
    tempCelsius: "Temp (°C)",
    symptoms: "Symptoms",
    noSymptomsReported: "No symptoms reported",
    medications: "Medications",
    riskFlags: "Risk Flags",
    clinicalNotes: "Clinical Notes",
    nextAppointment: "Next Appointment:",
    editVisit: "Edit Visit",
    printSummary: "Print Summary",
  },

  // -------------------------------------------------------------------------
  // Ultrasound Page
  // -------------------------------------------------------------------------
  ultrasoundPage: {
    title: "Ultrasound Imaging",
    subtitle: "Capture, store, and review ultrasound scans",
    totalScans: "Total Scans",
    pendingReview: "Pending Review",
    flagged: "Flagged",
    reviewed: "Reviewed",
    searchPlaceholder: "Search by patient...",
    allStatus: "All Status",
    uploadScan: "Upload Scan",
    quality: "quality",
    qualityExcellent: "Excellent",
    qualityGood: "Good",
    qualityFair: "Fair",
    qualityPoor: "Poor",

    // Detail modal
    ultrasoundDetails: "Ultrasound Details",
    captureDate: "Capture Date",
    capturedBy: "Captured By",
    reviewStatus: "Review Status",
    measurements: "Measurements",
    bpd: "BPD",
    fl: "FL",
    ac: "AC",
    hc: "HC",
    efw: "EFW",
    findings: "Findings",
    annotations: "Annotations",
    reviewedBy: "Reviewed by",
    markAsReviewed: "Mark as Reviewed",
    requestTeleconsult: "Request Teleconsult",
    share: "Share",
  },

  // -------------------------------------------------------------------------
  // Teleconsult Page
  // -------------------------------------------------------------------------
  teleconsultPage: {
    title: "Teleconsult",
    subtitle: "Asynchronous specialist consultations",
    totalRequests: "Total Requests",
    awaitingResponse: "Awaiting Response",
    emergency: "Emergency",
    resolved: "Resolved",
    allStatus: "All Status",
    pending: "Pending",
    assigned: "Assigned",
    inReview: "In Review",
    responded: "Responded",
    closed: "Closed",
    allPriorities: "All Priorities",
    routine: "Routine",
    urgent: "Urgent",
    newTeleconsult: "New Teleconsult",
    attachments: "attachments",

    // Detail modal
    teleconsultDetails: "Teleconsult Details",
    tabRequest: "Request",
    tabAttachments: "Attachments",
    tabResponse: "Response",
    requestedBy: "Requested By",
    requestDate: "Request Date",
    assignedTo: "Assigned To",
    chiefComplaint: "Chief Complaint",
    clinicalNotes: "Clinical Notes",
    responseFrom: "Response from",
    diagnosis: "Diagnosis",
    recommendations: "Recommendations",
    followUpInstructions: "Follow-up Instructions",
    prescriptions: "Prescriptions",
    sendResponse: "Send Response",
    viewPatientRecord: "View Patient Record",
    closeConsultation: "Close Consultation",
  },

  // -------------------------------------------------------------------------
  // GBV Page
  // -------------------------------------------------------------------------
  gbvPage: {
    title: "GBV Reporting",
    subtitle: "Secure gender-based violence case management",
    restrictedAccess: "Restricted Access Module",
    restrictedDescription: "GBV data is encrypted and access is logged. Only authorized personnel can view case details.",
    totalCases: "Total Cases",
    openCases: "Open Cases",
    inProgress: "In Progress",
    resolvedCases: "Resolved",
    allCases: "All Cases",
    open: "Open",
    referred: "Referred",
    closed: "Closed",
    newCaseIntake: "New Case Intake",
    gbvCases: "GBV Cases",
    casePrefix: "Case #",
    restricted: "Restricted",
    confidential: "Confidential",

    // Incident types
    physicalViolence: "Physical Violence",
    sexualViolence: "Sexual Violence",
    emotionalAbuse: "Emotional Abuse",
    economicAbuse: "Economic Abuse",
    other: "Other",

    reported: "Reported",
    reportedBy: "Reported by",
    followUp: "Follow-up:",
    referralsMade: "referral(s) made",
    accessLogged: "Confidential case data. Access is being logged.",
    incidentType: "Incident Type",
    reportDate: "Report Date",
    incidentDetails: "Incident Details",
    incidentDate: "Incident date:",
    perpetratorRelation: "Perpetrator relation:",
    injuriesDocumented: "Injuries Documented",
    safetyPlan: "Safety Plan",
    referralsMadeTitle: "Referrals Made",
    followUpScheduled: "Follow-up scheduled:",
    updateCase: "Update Case",
    scheduleFollowUp: "Schedule Follow-up",
    closeCase: "Close Case",
  },

  // -------------------------------------------------------------------------
  // Risk Assessment Page
  // -------------------------------------------------------------------------
  riskPage: {
    title: "AI Risk Assessment",
    subtitle: "Rule-based risk analysis and patient flagging",
    bannerTitle: "AI-Assisted Risk Assessment",
    bannerDescription: "Risk scores are calculated using rule-based logic analyzing patient data, vitals, and history. All flags are suggestions for clinician review - not diagnoses. Current rule version: 1.0.3",
    assessed: "Assessed",
    lowRisk: "Low Risk",
    highRisk: "High Risk",
    critical: "Critical",
    flaggedPatients: "Flagged Patients",
    riskScore: "Risk Score",
    activeRules: "Active Rules",

    // Risk rules
    advancedMaternalAge: "Advanced Maternal Age",
    advancedMaternalAgeDesc: "Patient age ≥ 35 years",
    grandMultipara: "Grand Multipara",
    grandMultiparaDesc: "Gravida ≥ 5",
    teenagePregnancy: "Teenage Pregnancy",
    teenagePregnancyDesc: "Patient age < 18 years",
    hypertensionRisk: "Hypertension Risk",
    hypertensionRiskDesc: "BP systolic ≥ 140 or diastolic ≥ 90",
    previousCesarean: "Previous Cesarean",
    previousCesareanDesc: "History of cesarean section",
    anemia: "Anemia",
    anemiaDesc: "Hemoglobin < 11 g/dL",
    ruleVersionFooter: "Rule Version: 1.0.3 • Last updated: Nov 2024",

    // Legend
    riskScoreLegend: "Risk Score Legend",
    legendLow: "0-24: Low Risk",
    legendMedium: "25-49: Medium Risk",
    legendHigh: "50-74: High Risk",
    legendCritical: "75-100: Critical",

    // Detail modal
    riskAssessmentDetails: "Risk Assessment Details",
    yearsOld: "years old",
    calculatedRiskScore: "Calculated Risk Score",
    triggeredRiskFactors: "Triggered Risk Factors",
    disclaimer: "This risk assessment is generated by rule-based analysis and is intended as a clinical decision support tool only. All flags should be reviewed and validated by a qualified healthcare provider.",
    note: "Note:",
    viewFullRecord: "View Full Record",
    overrideFlag: "Override Flag",
  },

  // -------------------------------------------------------------------------
  // Analytics Page
  // -------------------------------------------------------------------------
  analyticsPage: {
    title: "Analytics",
    subtitle: "Program insights and performance metrics",
    allClinics: "All Clinics",
    last30Days: "Last 30 Days",
    last90Days: "Last 90 Days",
    last6Months: "Last 6 Months",
    lastYear: "Last Year",
    exportReport: "Export Report",
    totalPatients: "Total Patients",
    activePregnancies: "Active Pregnancies",
    visitsMonth: "Visits (Month)",
    highRisk: "High Risk",
    teleconsults: "Teleconsults",
    gbvReports: "GBV Reports",

    // Tabs
    tabOverview: "Overview",
    tabPatientAnalytics: "Patient Analytics",
    tabClinicalMetrics: "Clinical Metrics",
    tabOperations: "Operations",

    // Cards
    patientDemographics: "Patient Demographics",
    age15_19: "Age 15-19",
    age20_24: "Age 20-24",
    age25_29: "Age 25-29",
    age30_34: "Age 30-34",
    age35plus: "Age 35+",
    gravidityDistribution: "Gravidity Distribution",
    primigravida: "Primigravida (G1)",
    g2g3: "G2-G3",
    g4g5: "G4-G5",
    grandMultipara: "Grand multipara (G6+)",
    ancVisitCompliance: "ANC Visit Compliance",
    firstTrimester: "1st Trimester (≥1 visit)",
    secondTrimester: "2nd Trimester (≥2 visits)",
    thirdTrimester: "3rd Trimester (≥4 visits total)",
    completeANC: "Complete ANC (8+ visits)",
    ultrasoundCoverage: "Ultrasound Coverage",
    patientsWithUltrasound: "Patients with at least one ultrasound",
    totalScans: "Total Scans",
    avgPerPatient: "Avg per Patient",
    clinicPerformance: "Clinic Performance",
    dataSyncHealth: "Data Sync Health",
    syncRate: "Sync Rate",
    pendingUploads: "Pending Uploads",
    conflicts: "Conflicts",
    lastSync: "Last Sync",
    thirtyMinAgo: "30 min ago",
  },

  // -------------------------------------------------------------------------
  // Alerts Page
  // -------------------------------------------------------------------------
  alertsPage: {
    title: "Alerts & Notifications",
    subtitle: "System alerts, reminders, and important notifications",
    totalAlerts: "Total Alerts",
    unread: "Unread",
    critical: "Critical",
    acknowledged: "Acknowledged",
    allTypes: "All Types",
    riskAlerts: "Risk Alerts",
    appointments: "Appointments",
    teleconsults: "Teleconsults",
    gbv: "GBV",
    sync: "Sync",
    system: "System",
    allPriorities: "All Priorities",
    high: "High",
    medium: "Medium",
    low: "Low",
    markAllRead: "Mark All Read",
    clearAll: "Clear All",
    notificationsTitle: "Notifications",
    patientPrefix: "Patient:",
    takeAction: "Take Action",
    noAlertsMatching: "No alerts matching your filters",
  },

  // -------------------------------------------------------------------------
  // Sync Page
  // -------------------------------------------------------------------------
  syncPage: {
    title: "Sync Status",
    subtitle: "Data synchronization and offline queue management",
    onlineConnected: "Online - Connected to Server",
    offlineNoConnection: "Offline - No Connection",
    lastSync: "Last sync:",
    syncNow: "Sync Now",
    syncing: "Syncing...",
    pendingUploads: "Pending Uploads",
    pendingDownloads: "Pending Downloads",
    conflicts: "Conflicts",
    syncRate: "Sync Rate",
    syncQueue: "Sync Queue",
    syncConflicts: "Sync Conflicts",
    conflictIn: "Conflict in:",
    requiresResolution: "Requires Resolution",
    localValue: "Local Value",
    serverValue: "Server Value",
    keepLocal: "Keep Local",
    keepServer: "Keep Server",
    manualReview: "Manual Review",
    clinicSyncStatus: "Clinic Sync Status",
    storageInfo: "Storage Info",
    localDatabase: "Local Database",
    ultrasoundImages: "Ultrasound Images",
    syncCache: "Sync Cache",
    totalUsed: "Total Used",
    uploaded: "uploaded",
    percentUploaded: "% uploaded",
    statusUploading: "Uploading",
    statusDownloading: "Downloading",
    statusCompleted: "Completed",
    statusFailed: "Failed",
    actionCreate: "Create",
    actionUpdate: "Update",
    actionDelete: "Delete",
    entityVisit: "Visit",
    entityPatient: "Patient",
    entityUltrasound: "Ultrasound",
    entityGbvReport: "GBV Report",
    entityTeleconsult: "Teleconsult",
  },

  // -------------------------------------------------------------------------
  // Settings Page
  // -------------------------------------------------------------------------
  settingsPage: {
    title: "Settings",
    subtitle: "System configuration and user management",
    tabProfile: "Profile",
    tabUserManagement: "User Management",
    tabNotifications: "Notifications",
    tabSecurity: "Security",
    tabSystem: "System",

    // Profile
    profileInformation: "Profile Information",
    changePhoto: "Change Photo",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    administrator: "Administrator",
    doctor: "Doctor",
    midwife: "Midwife",
    nurse: "Nurse",
    saveChanges: "Save Changes",

    // Preferences
    preferences: "Preferences",
    darkMode: "Dark Mode",
    language: "Language",
    english: "English",
    amharic: "Amharic",
    somali: "Somali",
    timezone: "Timezone",
    eatTimezone: "East Africa Time (UTC+3)",
    utcTimezone: "UTC",

    // User management
    addUser: "Add User",

    // Notifications
    notificationSettings: "Notification Settings",
    criticalRiskAlerts: "Critical risk alerts",
    criticalRiskAlertsDesc: "Immediate notification for critical patient risks",
    teleconsultResponses: "Teleconsult responses",
    teleconsultResponsesDesc: "When a specialist responds to your consultation",
    appointmentReminders: "Appointment reminders",
    appointmentRemindersDesc: "Upcoming patient appointment notifications",
    syncStatusUpdates: "Sync status updates",
    syncStatusUpdatesDesc: "Data synchronization success/failure alerts",
    gbvCaseUpdates: "GBV case updates",
    gbvCaseUpdatesDesc: "Updates on gender-based violence cases",
    systemAnnouncements: "System announcements",
    systemAnnouncementsDesc: "Platform updates and maintenance notices",

    // Security
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    updatePassword: "Update Password",
    activeSessions: "Active Sessions",
    currentSession: "Current Session",
    chromeOnMac: "Chrome on macOS",
    mobileApp: "Mobile App",
    androidLastActive: "Android - Last active 2h ago",
    revoke: "Revoke",

    // System
    systemInformation: "System Information",
    riskRulesVersion: "Risk Rules Version",
    database: "Database",
    sqlcipherEncrypted: "SQLCipher (Encrypted)",
    apiEndpoint: "API Endpoint",
    encryption: "Encryption",
    aesEncryption: "AES-256 / TLS 1.3",
    dataManagement: "Data Management",
    forceSyncAll: "Force Sync All Data",
    clearLocalCache: "Clear Local Cache",
    resetRiskRules: "Reset Risk Rules",
    clearAllLocalData: "Clear All Local Data",
    clearDataWarning: "This will remove all locally stored data. Server data is not affected.",
  },

  // -------------------------------------------------------------------------
  // Sync Status Values (used across pages)
  // -------------------------------------------------------------------------
  syncStatus: {
    synced: "Synced",
    pending: "Pending",
    conflict: "Conflict",
  },

  // -------------------------------------------------------------------------
  // Risk Level Values (used across pages)
  // -------------------------------------------------------------------------
  riskLevel: {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  },

  // -------------------------------------------------------------------------
  // Priority Values
  // -------------------------------------------------------------------------
  priority: {
    routine: "Routine",
    urgent: "Urgent",
    emergency: "Emergency",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  },
};

export type TranslationKeys = typeof en;
export default en;
