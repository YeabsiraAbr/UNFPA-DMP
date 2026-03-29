'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Progress } from '@/components/ui/Progress'
import { LoadingState } from '@/components/ui/LoadingState'
import { getCachedPatients, visitService, clearCache } from '@/services'
import { downloadCsv } from '@/lib/download'
import type { Patient as ApiPatient, Visit as ApiVisit } from '@/services/types'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Search,
  Plus,
  Calendar,
  Activity,
  Thermometer,
  Weight,
  Heart,
  Baby,
  Stethoscope,
  FileText,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  RefreshCcw,
  Download,
} from 'lucide-react'
import type { PrenatalVisit, Patient } from '@/lib/types'

function patientFromApi(p: ApiPatient): Patient {
  return {
    id: p.id,
    fullName: p.fullName,
    age: p.age ?? 0,
    dateOfBirth: String((p as Record<string, unknown>).dateOfBirth ?? ''),
    idNumber: p.idNumber ?? '',
    phoneNumber: String((p as Record<string, unknown>).phoneNumber ?? ''),
    address: p.address ?? '',
    village: String((p as Record<string, unknown>).village ?? ''),
    emergencyContact: p.emergencyContact ?? '',
    emergencyPhone: p.emergencyPhone ?? '',
    pregnancyStatus: String((p as Record<string, unknown>).pregnancyStatus ?? 'pregnant') as Patient['pregnancyStatus'],
    gravida: Number((p as Record<string, unknown>).gravida ?? 0),
    para: Number((p as Record<string, unknown>).para ?? 0),
    riskLevel: String((p as Record<string, unknown>).riskLevel ?? 'low') as Patient['riskLevel'],
    riskScore: Number((p as Record<string, unknown>).riskScore ?? 0),
    riskFactors: ((p as Record<string, unknown>).riskFactors as string[]) ?? [],
    registeredAt: String((p as Record<string, unknown>).registeredAt ?? (p as Record<string, unknown>).createdAt ?? ''),
    assignedMidwife: String((p as Record<string, unknown>).assignedMidwife ?? ''),
    syncStatus: String((p as Record<string, unknown>).syncStatus ?? 'synced') as Patient['syncStatus'],
    clinicId: String((p as Record<string, unknown>).clinicId ?? ''),
  }
}

function visitToPrenatal(v: ApiVisit): PrenatalVisit {
  const extra = v as ApiVisit & {
    remarks?: string
    visitNumber?: number
    fetalHeartRate?: string
    uterineHeightWks?: number
  }
  const bpStr = v.bloodPressure ?? ''
  const bpParts = bpStr.split('/').map((s) => parseFloat(s.trim()) || 0)
  const systolic = bpParts[0] ?? 0
  const diastolic = bpParts[1] ?? 0
  const weeks = typeof extra.uterineHeightWks === 'number' ? extra.uterineHeightWks : 0
  const fhr = extra.fetalHeartRate
  return {
    id: v.id,
    patientId: v.patientId,
    visitDate: v.visitDate,
    visitNumber: typeof extra.visitNumber === 'number' ? extra.visitNumber : 1,
    gestationalAge: { weeks, days: 0 },
    vitals: {
      bloodPressureSystolic: systolic,
      bloodPressureDiastolic: diastolic,
      weight: v.weight ?? 0,
      temperature: v.temperature ?? 0,
      pulse: 0,
      respiratoryRate: 0,
      fetalHeartRate: fhr ? parseInt(fhr, 10) : undefined,
    },
    symptoms: [],
    medications: [],
    notes: typeof extra.remarks === 'string' ? extra.remarks : '',
    riskFlags: [],
    conductedBy: '',
    syncStatus: 'synced',
  }
}

export default function PrenatalCarePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVisit, setSelectedVisit] = useState<PrenatalVisit | null>(null)
  const [showVisitModal, setShowVisitModal] = useState(false)
  const [showNewVisitModal, setShowNewVisitModal] = useState(false)
  const [newVisitForm, setNewVisitForm] = useState({
    patientId: '',
    visitDate: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
  })
  const [creatingVisit, setCreatingVisit] = useState(false)
  const [showEditVisitModal, setShowEditVisitModal] = useState(false)
  const [editVisitId, setEditVisitId] = useState('')
  const [editVisitForm, setEditVisitForm] = useState({
    visitDate: '',
    bloodPressure: '',
    temperature: '',
    weight: '',
  })
  const [updatingVisit, setUpdatingVisit] = useState(false)
  const [visits, setVisits] = useState<PrenatalVisit[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async (opts?: { showPageLoading?: boolean }) => {
    const showPageLoading = opts?.showPageLoading !== false
    if (showPageLoading) setLoading(true)
    try {
      const apiPatients = await getCachedPatients()
      if (!apiPatients.length) {
        setPatients([])
        setVisits([])
        return
      }
      const mappedPatients = apiPatients.map(patientFromApi)
      setPatients(mappedPatients)
      const allVisits: PrenatalVisit[] = []
      for (const p of apiPatients.slice(0, 20)) {
        try {
          const vRes = await visitService.getByPatient(p.id)
          if (vRes.success && vRes.visits?.length) {
            allVisits.push(...vRes.visits.map(visitToPrenatal))
          }
        } catch {
          /* ignore */
        }
      }
      setVisits(allVisits)
    } catch {
      setPatients([])
      setVisits([])
    } finally {
      if (showPageLoading) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateVisit = async () => {
    if (!newVisitForm.patientId || !newVisitForm.visitDate) return
    setCreatingVisit(true)
    try {
      await visitService.create({
        patientId: newVisitForm.patientId,
        visitDate: newVisitForm.visitDate,
        bloodPressure: newVisitForm.bloodPressure || undefined,
        temperature: newVisitForm.temperature ? parseFloat(newVisitForm.temperature) : undefined,
        weight: newVisitForm.weight ? parseFloat(newVisitForm.weight) : undefined,
      })
      setShowNewVisitModal(false)
      setNewVisitForm({ patientId: '', visitDate: '', bloodPressure: '', temperature: '', weight: '' })
      loadData({ showPageLoading: false })
    } catch {
      /* ignore */
    } finally {
      setCreatingVisit(false)
    }
  }

  const handleEditVisit = async () => {
    if (!editVisitId) return
    setUpdatingVisit(true)
    try {
      await visitService.update(editVisitId, {
        visitDate: editVisitForm.visitDate,
        bloodPressure: editVisitForm.bloodPressure || undefined,
        temperature: editVisitForm.temperature ? parseFloat(editVisitForm.temperature) : undefined,
        weight: editVisitForm.weight ? parseFloat(editVisitForm.weight) : undefined,
      })
      setShowEditVisitModal(false)
      setEditVisitId('')
      loadData({ showPageLoading: false })
    } catch {
      /* ignore */
    } finally {
      setUpdatingVisit(false)
    }
  }

  // Mock vitals trend data for chart
  const vitalsTrendData = [
    { visit: 'V1', systolic: 110, diastolic: 70, weight: 62, fhr: 140 },
    { visit: 'V2', systolic: 115, diastolic: 72, weight: 63, fhr: 142 },
    { visit: 'V3', systolic: 112, diastolic: 74, weight: 64, fhr: 145 },
    { visit: 'V4', systolic: 118, diastolic: 76, weight: 66, fhr: 148 },
    { visit: 'V5', systolic: 120, diastolic: 78, weight: 68, fhr: 145 },
  ]

  const getPatientForVisit = (visit: PrenatalVisit): Patient | undefined => {
    return patients.find((p) => p.id === visit.patientId)
  }

  const handleViewVisit = (visit: PrenatalVisit) => {
    setSelectedVisit(visit)
    setShowVisitModal(true)
  }

  const filteredVisits = visits.filter((visit) => {
    const patient = getPatientForVisit(visit)
    return patient?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  if (loading) {
    return (
      <DashboardLayout
        title="Prenatal Care"
        subtitle="Track prenatal visits, vitals, and patient progress"
      >
        <LoadingState message="Loading prenatal data…" />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Prenatal Care"
      subtitle="Track prenatal visits, vitals, and patient progress"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">{visits.length}</p>
              <p className="text-sm opacity-80">Total Visits</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <Baby className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {patients.filter((p) => p.pregnancyStatus === 'pregnant').length}
              </p>
              <p className="text-sm opacity-80">Active Pregnancies</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {visits.filter((v) => v.riskFlags.length > 0).length}
              </p>
              <p className="text-sm opacity-80">Visits with Risk Flags</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">8</p>
              <p className="text-sm opacity-80">Appointments Today</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visits List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Filter */}
          <Card className="p-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Search by patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <Select
                options={[
                  { value: 'all', label: 'All Visits' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                ]}
                value="all"
              />
              <Button
                variant="outline"
                onClick={() => {
                  clearCache('patients-list')
                  loadData()
                }}
                disabled={loading}
              >
                <RefreshCcw className={cn('w-4 h-4', loading && 'animate-spin')} />
                Refresh
              </Button>
              <Button
                variant="outline"
                disabled={!filteredVisits.length}
                onClick={() => {
                  const rows: Record<string, unknown>[] = filteredVisits.map((v) => ({
                    ...(JSON.parse(JSON.stringify(v)) as Record<string, unknown>),
                    patientName: getPatientForVisit(v)?.fullName ?? '',
                  }))
                  downloadCsv(`prenatal-visits-${new Date().toISOString().slice(0, 10)}.csv`, rows)
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button variant="primary" onClick={() => setShowNewVisitModal(true)}>
                <Plus className="w-4 h-4" />
                New Visit
              </Button>
            </div>
          </Card>

          {/* Recent Visits */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-brand-500" />
                Recent Prenatal Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVisits.map((visit, index) => {
                  const patient = getPatientForVisit(visit)
                  if (!patient) return null

                  return (
                    <div
                      key={visit.id}
                      onClick={() => handleViewVisit(visit)}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all duration-200',
                        'hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800',
                        visit.riskFlags.length > 0
                          ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10'
                          : 'border-slate-200 dark:border-slate-700',
                        'animate-slide-up'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Avatar fallback={patient.fullName} size="md" />
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {patient.fullName}
                            </h4>
                            <p className="text-sm text-slate-500">
                              Visit #{visit.visitNumber} • {visit.gestationalAge.weeks}w{visit.gestationalAge.days}d
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="info" size="sm">
                                {formatDate(visit.visitDate)}
                              </Badge>
                              <Badge variant={visit.syncStatus === 'synced' ? 'success' : 'warning'} size="sm">
                                {visit.syncStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                              <Activity className="w-4 h-4 mx-auto text-brand-500" />
                              <p className="font-semibold mt-1">
                                {visit.vitals.bloodPressureSystolic}/{visit.vitals.bloodPressureDiastolic}
                              </p>
                              <p className="text-xs text-slate-500">BP</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                              <Heart className="w-4 h-4 mx-auto text-red-500" />
                              <p className="font-semibold mt-1">{visit.vitals.fetalHeartRate || '-'}</p>
                              <p className="text-xs text-slate-500">FHR</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {visit.riskFlags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          {visit.riskFlags.map((flag) => (
                            <Badge key={flag} variant="warning" size="sm">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vitals Trend Chart */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-500" />
                Vitals Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vitalsTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="visit" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      name="Systolic BP"
                      stroke="#0891b2"
                      strokeWidth={2}
                      dot={{ fill: '#0891b2' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      name="Diastolic BP"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Quick Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-medium text-emerald-800 dark:text-emerald-300">Normal Ranges</h4>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-700 dark:text-emerald-400">
                    <li>• BP: 90/60 - 120/80 mmHg</li>
                    <li>• FHR: 110-160 bpm</li>
                    <li>• Temp: 36.1-37.2°C</li>
                    <li>• Fundal height = GA (±2cm)</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium text-amber-800 dark:text-amber-300">Warning Signs</h4>
                  <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400">
                    <li>• BP ≥ 140/90 mmHg</li>
                    <li>• Proteinuria</li>
                    <li>• Severe headache</li>
                    <li>• Visual disturbances</li>
                    <li>• Reduced fetal movement</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visit Detail Modal */}
      <Modal
        isOpen={showVisitModal}
        onClose={() => setShowVisitModal(false)}
        title={`Visit Details`}
        size="lg"
      >
        {selectedVisit && (
          <div className="space-y-6">
            {/* Visit Info */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="text-sm text-slate-500">Visit #{selectedVisit.visitNumber}</p>
                <p className="font-semibold text-lg">
                  {selectedVisit.gestationalAge.weeks}w{selectedVisit.gestationalAge.days}d
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Date</p>
                <p className="font-semibold">{formatDate(selectedVisit.visitDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Conducted By</p>
                <p className="font-semibold">{selectedVisit.conductedBy}</p>
              </div>
            </div>

            {/* Vitals Grid */}
            <div>
              <h4 className="font-semibold mb-3">Vital Signs</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <Activity className="w-5 h-5 mx-auto text-brand-500" />
                  <p className="text-2xl font-bold mt-2">
                    {selectedVisit.vitals.bloodPressureSystolic}/{selectedVisit.vitals.bloodPressureDiastolic}
                  </p>
                  <p className="text-sm text-slate-500">Blood Pressure</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <Heart className="w-5 h-5 mx-auto text-red-500" />
                  <p className="text-2xl font-bold mt-2">{selectedVisit.vitals.fetalHeartRate || 'N/A'}</p>
                  <p className="text-sm text-slate-500">FHR (bpm)</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <Weight className="w-5 h-5 mx-auto text-purple-500" />
                  <p className="text-2xl font-bold mt-2">{selectedVisit.vitals.weight}</p>
                  <p className="text-sm text-slate-500">Weight (kg)</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <Thermometer className="w-5 h-5 mx-auto text-amber-500" />
                  <p className="text-2xl font-bold mt-2">{selectedVisit.vitals.temperature}</p>
                  <p className="text-sm text-slate-500">Temp (°C)</p>
                </div>
              </div>
            </div>

            {/* Symptoms & Medications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVisit.symptoms.length > 0 ? (
                    selectedVisit.symptoms.map((symptom) => (
                      <Badge key={symptom} variant="outline" size="md">
                        {symptom}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">No symptoms reported</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Medications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVisit.medications.map((med) => (
                    <Badge key={med} variant="info" size="md">
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Flags */}
            {selectedVisit.riskFlags.length > 0 && (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300">Risk Flags</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedVisit.riskFlags.map((flag) => (
                    <Badge key={flag} variant="danger" size="md">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h4 className="font-semibold mb-3">Clinical Notes</h4>
              <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                {selectedVisit.notes}
              </p>
            </div>

            {/* Next Appointment */}
            {selectedVisit.nextAppointment && (
              <div className="p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-600" />
                  <span className="font-medium">Next Appointment:</span>
                  <span>{formatDate(selectedVisit.nextAppointment)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="primary"
                onClick={() => {
                  if (!selectedVisit) return
                  const d = new Date(selectedVisit.visitDate)
                  const pad = (n: number) => String(n).padStart(2, '0')
                  const localDate =
                    Number.isNaN(d.getTime())
                      ? selectedVisit.visitDate.slice(0, 16)
                      : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
                  const { bloodPressureSystolic: sys, bloodPressureDiastolic: dia } = selectedVisit.vitals
                  const bp =
                    sys > 0 || dia > 0 ? `${sys}/${dia}` : ''
                  setEditVisitId(selectedVisit.id)
                  setEditVisitForm({
                    visitDate: localDate,
                    bloodPressure: bp,
                    temperature:
                      selectedVisit.vitals.temperature > 0 ? String(selectedVisit.vitals.temperature) : '',
                    weight: selectedVisit.vitals.weight > 0 ? String(selectedVisit.vitals.weight) : '',
                  })
                  setShowEditVisitModal(true)
                }}
              >
                <FileText className="w-4 h-4" />
                Edit Visit
              </Button>
              <Button type="button" variant="outline" onClick={() => window.print()}>
                Print Summary
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showNewVisitModal} onClose={() => setShowNewVisitModal(false)} title="New Prenatal Visit" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              value={newVisitForm.patientId}
              onChange={(e) => setNewVisitForm({ ...newVisitForm, patientId: e.target.value })}
            >
              <option value="">Select a patient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Visit Date"
            type="datetime-local"
            value={newVisitForm.visitDate}
            onChange={(e) => setNewVisitForm({ ...newVisitForm, visitDate: e.target.value })}
          />
          <Input
            label="Blood Pressure"
            placeholder="e.g. 120/80"
            value={newVisitForm.bloodPressure}
            onChange={(e) => setNewVisitForm({ ...newVisitForm, bloodPressure: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Temperature (°C)"
              type="number"
              step="0.1"
              value={newVisitForm.temperature}
              onChange={(e) => setNewVisitForm({ ...newVisitForm, temperature: e.target.value })}
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={newVisitForm.weight}
              onChange={(e) => setNewVisitForm({ ...newVisitForm, weight: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleCreateVisit} isLoading={creatingVisit}>
              Create Visit
            </Button>
            <Button variant="ghost" onClick={() => setShowNewVisitModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showEditVisitModal} onClose={() => setShowEditVisitModal(false)} title="Edit Prenatal Visit" size="md">
        <div className="space-y-4">
          <Input
            label="Visit Date"
            type="datetime-local"
            value={editVisitForm.visitDate}
            onChange={(e) => setEditVisitForm({ ...editVisitForm, visitDate: e.target.value })}
          />
          <Input
            label="Blood Pressure"
            placeholder="e.g. 120/80"
            value={editVisitForm.bloodPressure}
            onChange={(e) => setEditVisitForm({ ...editVisitForm, bloodPressure: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Temperature (°C)"
              type="number"
              step="0.1"
              value={editVisitForm.temperature}
              onChange={(e) => setEditVisitForm({ ...editVisitForm, temperature: e.target.value })}
            />
            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={editVisitForm.weight}
              onChange={(e) => setEditVisitForm({ ...editVisitForm, weight: e.target.value })}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleEditVisit} isLoading={updatingVisit}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setShowEditVisitModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}




