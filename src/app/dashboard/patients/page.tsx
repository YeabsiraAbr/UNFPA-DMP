'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Progress } from '@/components/ui/Progress'
import { mockPatients, mockPrenatalVisits, mockClinics } from '@/lib/mock-data'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Baby,
  Heart,
  AlertTriangle,
  RefreshCcw,
  MoreVertical,
  ChevronRight,
  User,
  Clock,
} from 'lucide-react'
import type { Patient } from '@/lib/types'

const riskBadgeVariant = {
  low: 'success' as const,
  medium: 'warning' as const,
  high: 'warning' as const,
  critical: 'danger' as const,
}

const syncBadgeVariant = {
  synced: 'success' as const,
  pending: 'warning' as const,
  conflict: 'danger' as const,
}

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState('all')
  const [clinicFilter, setClinicFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientModal, setShowPatientModal] = useState(false)

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch =
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.idNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter
    const matchesClinic = clinicFilter === 'all' || patient.clinicId === clinicFilter
    return matchesSearch && matchesRisk && matchesClinic
  })

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowPatientModal(true)
  }

  const patientVisits = selectedPatient
    ? mockPrenatalVisits.filter((v) => v.patientId === selectedPatient.id)
    : []

  return (
    <DashboardLayout
      title="Patient Management"
      subtitle="Register, view, and manage maternal patient records"
    >
      {/* Filters & Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-1 gap-3 flex-wrap">
              <div className="w-64">
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <Select
                options={[
                  { value: 'all', label: 'All Risk Levels' },
                  { value: 'low', label: 'Low Risk' },
                  { value: 'medium', label: 'Medium Risk' },
                  { value: 'high', label: 'High Risk' },
                  { value: 'critical', label: 'Critical' },
                ]}
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
              />
              <Select
                options={[
                  { value: 'all', label: 'All Clinics' },
                  ...mockClinics.map((c) => ({ value: c.id, label: c.name })),
                ]}
                value={clinicFilter}
                onChange={(e) => setClinicFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="md">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="primary" size="md">
                <Plus className="w-4 h-4" />
                New Patient
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredPatients.length}
              </p>
              <p className="text-sm text-slate-500">Total Patients</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <Baby className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredPatients.filter((p) => p.pregnancyStatus === 'pregnant').length}
              </p>
              <p className="text-sm text-slate-500">Active Pregnancies</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredPatients.filter((p) => p.riskLevel === 'high' || p.riskLevel === 'critical').length}
              </p>
              <p className="text-sm text-slate-500">High Risk</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <RefreshCcw className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {filteredPatients.filter((p) => p.syncStatus === 'pending').length}
              </p>
              <p className="text-sm text-slate-500">Pending Sync</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Patients Table */}
      <Card variant="elevated">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient, index) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => handleViewPatient(patient)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar fallback={patient.fullName} size="sm" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {patient.fullName}
                        </p>
                        <p className="text-xs text-slate-500">{patient.village}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{patient.idNumber}</TableCell>
                  <TableCell>{patient.age}y</TableCell>
                  <TableCell>
                    <Badge
                      variant={patient.pregnancyStatus === 'pregnant' ? 'info' : 'default'}
                      size="sm"
                    >
                      {patient.pregnancyStatus === 'pregnant' ? 'Pregnant' : 
                       patient.pregnancyStatus === 'postpartum' ? 'Postpartum' : 'Not Pregnant'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={riskBadgeVariant[patient.riskLevel]}
                      size="sm"
                      dot
                      pulse={patient.riskLevel === 'critical'}
                    >
                      {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {patient.lastVisit ? formatRelativeTime(patient.lastVisit) : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={syncBadgeVariant[patient.syncStatus]} size="sm">
                      {patient.syncStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                      <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Detail Modal */}
      <Modal
        isOpen={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title={selectedPatient?.fullName}
        description={selectedPatient?.idNumber}
        size="xl"
      >
        {selectedPatient && (
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="visits">Visits ({patientVisits.length})</TabsTrigger>
              <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Personal Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">Age:</span>
                      <span className="text-slate-900 dark:text-white">{selectedPatient.age} years</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">DOB:</span>
                      <span className="text-slate-900 dark:text-white">
                        {formatDate(selectedPatient.dateOfBirth)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">Phone:</span>
                      <span className="text-slate-900 dark:text-white">
                        {selectedPatient.phoneNumber || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">Address:</span>
                      <span className="text-slate-900 dark:text-white">
                        {selectedPatient.address}, {selectedPatient.village}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Obstetric Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    Obstetric Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Baby className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">G/P:</span>
                      <span className="text-slate-900 dark:text-white">
                        G{selectedPatient.gravida}P{selectedPatient.para}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Heart className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">Blood Type:</span>
                      <span className="text-slate-900 dark:text-white">
                        {selectedPatient.bloodType || 'Unknown'}
                      </span>
                    </div>
                    {selectedPatient.lmpDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500">LMP:</span>
                        <span className="text-slate-900 dark:text-white">
                          {formatDate(selectedPatient.lmpDate)}
                        </span>
                      </div>
                    )}
                    {selectedPatient.eddDate && (
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-500">EDD:</span>
                        <span className="text-slate-900 dark:text-white">
                          {formatDate(selectedPatient.eddDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Risk Info */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                    Risk Assessment
                  </h4>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-slate-400" />
                        <span className="font-medium">Risk Score</span>
                      </div>
                      <span className="text-2xl font-bold">{selectedPatient.riskScore}/100</span>
                    </div>
                    <Progress
                      value={selectedPatient.riskScore}
                      variant={selectedPatient.riskLevel === 'critical' ? 'danger' : 
                               selectedPatient.riskLevel === 'high' ? 'warning' : 'default'}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedPatient.riskFactors.map((factor) => (
                        <Badge key={factor} variant="outline" size="md">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button variant="primary">
                  <Edit className="w-4 h-4" />
                  Edit Patient
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4" />
                  Schedule Visit
                </Button>
                <Button variant="ghost">
                  <ChevronRight className="w-4 h-4" />
                  Full Profile
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="visits">
              <div className="space-y-4">
                {patientVisits.length > 0 ? (
                  patientVisits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">Visit #{visit.visitNumber}</h4>
                            <Badge variant="info" size="sm">
                              {visit.gestationalAge.weeks}w{visit.gestationalAge.days}d
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">
                            {formatDate(visit.visitDate)} by {visit.conductedBy}
                          </p>
                        </div>
                        <Badge variant={syncBadgeVariant[visit.syncStatus]} size="sm">
                          {visit.syncStatus}
                        </Badge>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">BP</span>
                          <p className="font-medium">
                            {visit.vitals.bloodPressureSystolic}/{visit.vitals.bloodPressureDiastolic}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500">Weight</span>
                          <p className="font-medium">{visit.vitals.weight} kg</p>
                        </div>
                        <div>
                          <span className="text-slate-500">FHR</span>
                          <p className="font-medium">{visit.vitals.fetalHeartRate || 'N/A'} bpm</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Fundal Height</span>
                          <p className="font-medium">{visit.vitals.fundalHeight || 'N/A'} cm</p>
                        </div>
                      </div>
                      {visit.riskFlags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {visit.riskFlags.map((flag) => (
                            <Badge key={flag} variant="danger" size="sm">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No visits recorded yet
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="risk">
              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Overall Risk Score</h3>
                    <Badge
                      variant={riskBadgeVariant[selectedPatient.riskLevel]}
                      size="md"
                      dot
                      pulse={selectedPatient.riskLevel === 'critical'}
                    >
                      {selectedPatient.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                    {selectedPatient.riskScore}
                    <span className="text-lg font-normal text-slate-400">/100</span>
                  </div>
                  <Progress
                    value={selectedPatient.riskScore}
                    size="lg"
                    variant={selectedPatient.riskLevel === 'critical' ? 'danger' : 
                             selectedPatient.riskLevel === 'high' ? 'warning' : 'success'}
                  />
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Active Risk Factors</h4>
                  <div className="space-y-2">
                    {selectedPatient.riskFactors.map((factor, index) => (
                      <div
                        key={factor}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="flex-1">{factor}</span>
                        <Badge variant="outline" size="sm">Active</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="text-center py-8 text-slate-500">
                Patient history timeline coming soon...
              </div>
            </TabsContent>
          </Tabs>
        )}
      </Modal>
    </DashboardLayout>
  )
}


