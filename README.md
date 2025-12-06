# UNFPA Digital Maternity Package (DMP) Dashboard

A comprehensive Next.js 15 dashboard application for the Digital Maternity Package system designed for UNFPA Mobile Health Clinics in Ethiopia's Nogob Zone.

## Overview

This dashboard provides a complete management interface for maternal healthcare services in remote and low-connectivity environments. It supports the full workflow of frontline health workers, specialists, and administrators.

## Features

### 🏥 Patient Management
- Patient registration and record management
- Obstetric history tracking (gravida, para, LMP, EDD)
- Risk level assessment and visualization
- Search, filter, and export capabilities

### 👶 Prenatal Care Tracking
- Visit recording with vitals (BP, weight, temperature, FHR)
- Gestational age calculation
- Symptom and medication tracking
- Vitals trend visualization over time
- Risk flag alerts

### 🔬 Ultrasound Imaging
- Image gallery with grid/list views
- Measurement annotations (BPD, FL, AC, HC, EFW)
- Review status tracking (pending, reviewed, flagged)
- Quality assessment indicators

### 🛡️ GBV Reporting (Restricted Access)
- Secure case intake forms
- Confidentiality level controls
- Referral tracking
- Follow-up scheduling
- Access logging for audit

### 💬 Teleconsult
- Asynchronous specialist consultations
- Priority-based triage (routine, urgent, emergency)
- File attachments (visit notes, ultrasounds, lab results)
- Response tracking with recommendations

### 🔔 Alerts & Notifications
- Risk alerts for critical patients
- Appointment reminders
- Teleconsult response notifications
- Sync status updates
- GBV case follow-up alerts

### 📊 Analytics Dashboard
- KPI overview cards
- Visit trends and patient demographics
- Risk distribution charts
- Gestational age distribution
- Teleconsult metrics
- Clinic performance comparison

### 🤖 AI Risk Assessment
- Rule-based risk scoring (0-100)
- Risk factor identification
- Triggered rule explanations
- Override capabilities with logging
- Version-controlled rule sets

### 🔄 Sync Status
- Real-time connection monitoring
- Pending upload/download tracking
- Conflict resolution interface
- Storage usage monitoring
- Per-clinic sync status

### 🏢 Clinic Management
- Mobile unit and fixed facility tracking
- Staff assignment
- Patient count statistics
- Last sync timestamps

### ⚙️ Settings
- User profile management
- Role-based user administration
- Notification preferences
- Security settings (password, sessions)
- System information

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/
│   │   ├── patients/       # Patient management
│   │   ├── prenatal/       # Prenatal care tracking
│   │   ├── ultrasound/     # Ultrasound imaging
│   │   ├── gbv/            # GBV reporting
│   │   ├── teleconsult/    # Teleconsultations
│   │   ├── alerts/         # Notifications
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── risk/           # AI risk assessment
│   │   ├── sync/           # Sync status
│   │   ├── clinics/        # Clinic management
│   │   └── settings/       # Settings
│   └── globals.css
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── dashboard/          # Dashboard-specific components
└── lib/
    ├── types.ts            # TypeScript type definitions
    ├── utils.ts            # Utility functions
    └── mock-data.ts        # Demo data
```

## User Roles

The system supports multiple user classes:

1. **Midwife/Nurse** - Primary field workers
2. **Doctor/Specialist** - Remote consultants
3. **Admin** - System administrators
4. **Health Authority** - Oversight and reporting
5. **Partner Analyst** - M&E and analytics
6. **GBV Officer** - Violence case management

## Design Principles

- **Offline-First**: All features work without connectivity
- **Low Digital Literacy**: Simple, intuitive interfaces
- **Secure**: Role-based access, encryption, audit logging
- **Scalable**: Supports 200+ clinics, 100K+ patients
- **Responsive**: Works on desktop and tablets

## Security Features

- AES-256 local encryption
- TLS 1.2+ transport security
- Role-based access control (RBAC)
- Audit logging for sensitive data
- Session management with auto-expiry

## License

This project is developed for UNFPA by Center of Excellence International Consult.

---

*Digital Maternity Package v1.0 - November 2024*


