'use client'

import { useState, useEffect } from 'react'
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
import { patientService, visitService } from '@/services'
import { LoadingState } from '@/components/ui/LoadingState'
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
  Trash2,
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
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  const loadPatients = () => {
    setLoading(true)
    patientService.getAll().then((res) => {
      if (res.success && res.patients?.length) {
        setPatients(
          res.patients.map((p) => ({
            id: p.id,
            fullName: p.fullName,
            age: p.age ?? 0,
            dateOfBirth: '',
            idNumber: p.idNumber ?? (p as any).unfpId ?? '',
            phoneNumber: p.phone ?? undefined,
            address: p.address ?? '',
            village: p.woreda ?? '',
            emergencyContact: p.emergencyContact ?? '',
            emergencyPhone: p.emergencyPhone ?? '',
            pregnancyStatus: 'pregnant' as const,
            gravida: 0,
            para: 0,
            riskLevel: 'low' as const,
            riskScore: 0,
            riskFactors: [],
            registeredAt: p.createdAt,
            assignedMidwife: '',
            syncStatus: 'synced' as const,
            clinicId: p.facility ?? '',
          }))
        )
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { loadPatients() }, [])

  const filteredPatients = patients.filter((patient) => {
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

  const [createForm, setCreateForm] = useState({
    fullName: '',
    phone: '',
    age: '',
    address: '',
    subCity: '',
    woreda: '',
    kebele: '',
    houseNo: '',
    facility: '',
    maritalStatus: '',
    idNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
  })
  const [creating, setCreating] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', age: '', address: '', woreda: '', emergencyContact: '', emergencyPhone: '' })
  const [scheduleForm, setScheduleForm] = useState({ visitDate: '', bloodPressure: '', temperature: '', weight: '' })
  const [editing, setEditing] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [showEditVisitModal, setShowEditVisitModal] = useState(false)
  const [editVisitForm, setEditVisitForm] = useState({ visitDate: '', bloodPressure: '', temperature: '', weight: '' })
  const [editVisitId, setEditVisitId] = useState<string | null>(null)
  const [editingVisit, setEditingVisit] = useState(false)

  const handleCreatePatient = async () => {
    if (!createForm.fullName.trim()) return
    setCreating(true)
    try {
      const res = await patientService.create({
        fullName: createForm.fullName,
        phone: createForm.phone || undefined,
        age: createForm.age ? parseInt(createForm.age) : undefined,
        address: createForm.address || undefined,
        subCity: createForm.subCity || undefined,
        woreda: createForm.woreda || undefined,
        kebele: createForm.kebele || undefined,
        houseNo: createForm.houseNo || undefined,
        facility: createForm.facility || undefined,
        maritalStatus: createForm.maritalStatus || undefined,
        idNumber: createForm.idNumber || undefined,
        emergencyContact: createForm.emergencyContact || undefined,
        emergencyPhone: createForm.emergencyPhone || undefined,
      })
      if (res.success) {
        setShowCreateModal(false)
        setCreateForm({ fullName: '', phone: '', age: '', address: '', subCity: '', woreda: '', kebele: '', houseNo: '', facility: '', maritalStatus: '', idNumber: '', emergencyContact: '', emergencyPhone: '' })
        loadPatients()
      }
    } catch {
      // handled silently
    } finally {
      setCreating(false)
    }
  }

  const handleEditPatient = async () => {
    if (!selectedPatient || !editForm.fullName.trim()) return
    setEditing(true)
    try {
      await patientService.update(selectedPatient.id, {
        fullName: editForm.fullName,
        phone: editForm.phone || undefined,
        age: editForm.age ? parseInt(editForm.age) : undefined,
        address: editForm.address || undefined,
        woreda: editForm.woreda || undefined,
        emergencyContact: editForm.emergencyContact || undefined,
        emergencyPhone: editForm.emergencyPhone || undefined,
      })
      setShowEditModal(false)
      setShowPatientModal(false)
      loadPatients()
    } catch {} finally { setEditing(false) }
  }

  const handleDeletePatient = async () => {
    if (!selectedPatient || !confirm('Are you sure you want to delete this patient?')) return
    try {
      await patientService.delete(selectedPatient.id)
      setShowPatientModal(false)
      loadPatients()
    } catch {}
  }

  const handleScheduleVisit = async () => {
    if (!selectedPatient || !scheduleForm.visitDate) return
    setScheduling(true)
    try {
      await visitService.create({
        patientId: selectedPatient.id,
        visitDate: scheduleForm.visitDate,
        bloodPressure: scheduleForm.bloodPressure || undefined,
        temperature: scheduleForm.temperature ? parseFloat(scheduleForm.temperature) : undefined,
        weight: scheduleForm.weight ? parseFloat(scheduleForm.weight) : undefined,
      })
      setShowScheduleModal(false)
      setScheduleForm({ visitDate: '', bloodPressure: '', temperature: '', weight: '' })
      setSelectedPatient({ ...selectedPatient })
    } catch {} finally { setScheduling(false) }
  }

  const handleEditVisit = async () => {
    if (!editVisitId || !editVisitForm.visitDate) return
    setEditingVisit(true)
    try {
      await visitService.update(editVisitId, {
        visitDate: editVisitForm.visitDate,
        bloodPressure: editVisitForm.bloodPressure || undefined,
        temperature: editVisitForm.temperature ? parseFloat(editVisitForm.temperature) : undefined,
        weight: editVisitForm.weight ? parseFloat(editVisitForm.weight) : undefined,
      })
      setShowEditVisitModal(false)
      setEditVisitForm({ visitDate: '', bloodPressure: '', temperature: '', weight: '' })
      setEditVisitId(null)
      if (selectedPatient) setSelectedPatient({ ...selectedPatient })
    } catch {} finally { setEditingVisit(false) }
  }

  const handleDeleteVisit = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visit?')) return
    try {
      await visitService.delete(id)
      if (selectedPatient) setSelectedPatient({ ...selectedPatient })
    } catch {}
  }

  const openEditVisitModal = (visit: typeof patientVisits[number]) => {
    setEditVisitId(visit.id)
    setEditVisitForm({
      visitDate: visit.visitDate,
      bloodPressure: visit.vitals.bloodPressureSystolic ? `${visit.vitals.bloodPressureSystolic}/${visit.vitals.bloodPressureDiastolic}` : '',
      temperature: visit.vitals.temperature ? String(visit.vitals.temperature) : '',
      weight: visit.vitals.weight ? String(visit.vitals.weight) : '',
    })
    setShowEditVisitModal(true)
  }

  const openEditModal = () => {
    if (!selectedPatient) return
    setEditForm({
      fullName: selectedPatient.fullName,
      phone: selectedPatient.phoneNumber || '',
      age: String(selectedPatient.age),
      address: selectedPatient.address,
      woreda: selectedPatient.village,
      emergencyContact: selectedPatient.emergencyContact,
      emergencyPhone: selectedPatient.emergencyPhone,
    })
    setShowEditModal(true)
  }

  const [patientVisits, setPatientVisits] = useState<{
    id: string
    patientId: string
    visitDate: string
    visitNumber: number
    gestationalAge: { weeks: number; days: number }
    conductedBy: string
    syncStatus: 'synced' | 'pending' | 'conflict'
    riskFlags: string[]
    vitals: {
      bloodPressureSystolic: number
      bloodPressureDiastolic: number
      weight: number
      temperature: number
      fetalHeartRate: number
      fundalHeight: number
    }
  }[]>([])

  useEffect(() => {
    if (!selectedPatient) { setPatientVisits([]); return }
    visitService.getByPatient(selectedPatient.id).then(res => {
      if (res.success && res.visits?.length) {
        setPatientVisits(res.visits.map((v, i) => ({
          id: v.id,
          patientId: v.patientId,
          visitDate: v.visitDate,
          visitNumber: i + 1,
          gestationalAge: { weeks: 0, days: 0 },
          conductedBy: '',
          syncStatus: 'synced' as const,
          riskFlags: [] as string[],
          vitals: {
            bloodPressureSystolic: v.bloodPressure ? parseInt(v.bloodPressure.split('/')[0]) || 0 : 0,
            bloodPressureDiastolic: v.bloodPressure ? parseInt(v.bloodPressure.split('/')[1]) || 0 : 0,
            weight: v.weight ?? 0,
            temperature: v.temperature ?? 0,
            fetalHeartRate: 0,
            fundalHeight: 0,
          },
        })))
      }
    }).catch(() => {})
  }, [selectedPatient])

  if (loading) return (
    <DashboardLayout title="Patient Management" subtitle="Register, view, and manage maternal patient records">
      <LoadingState message="Loading patients..." />
    </DashboardLayout>
  )

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
              <Button variant="primary" size="md" onClick={() => setShowCreateModal(true)}>
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
                <Button variant="primary" onClick={openEditModal}>
                  <Edit className="w-4 h-4" />
                  Edit Patient
                </Button>
                <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
                  <Calendar className="w-4 h-4" />
                  Schedule Visit
                </Button>
                <Button variant="danger" onClick={handleDeletePatient}>
                  <Trash2 className="w-4 h-4" />
                  Delete Patient
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
                      <div className="mt-3 flex gap-2 justify-end">
                        <button
                          onClick={() => openEditVisitModal(visit)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                          title="Edit visit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVisit(visit.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete visit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Create Patient Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Register New Patient"
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter full name"
                value={createForm.fullName}
                onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
              <Input
                placeholder="Phone number"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Age</label>
              <Input
                placeholder="Age"
                type="number"
                value={createForm.age}
                onChange={(e) => setCreateForm({ ...createForm, age: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
              <Input
                placeholder="Address"
                value={createForm.address}
                onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sub City</label>
              <Input
                placeholder="Sub city"
                value={createForm.subCity}
                onChange={(e) => setCreateForm({ ...createForm, subCity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Woreda</label>
              <Input
                placeholder="Woreda"
                value={createForm.woreda}
                onChange={(e) => setCreateForm({ ...createForm, woreda: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kebele</label>
              <Input
                placeholder="Kebele"
                value={createForm.kebele}
                onChange={(e) => setCreateForm({ ...createForm, kebele: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">House No</label>
              <Input
                placeholder="House number"
                value={createForm.houseNo}
                onChange={(e) => setCreateForm({ ...createForm, houseNo: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Facility</label>
              <Input
                placeholder="Facility"
                value={createForm.facility}
                onChange={(e) => setCreateForm({ ...createForm, facility: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Marital Status</label>
              <Select
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'single', label: 'Single' },
                  { value: 'married', label: 'Married' },
                  { value: 'divorced', label: 'Divorced' },
                  { value: 'widowed', label: 'Widowed' },
                ]}
                value={createForm.maritalStatus}
                onChange={(e) => setCreateForm({ ...createForm, maritalStatus: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ID Number</label>
              <Input
                placeholder="ID number"
                value={createForm.idNumber}
                onChange={(e) => setCreateForm({ ...createForm, idNumber: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Contact</label>
              <Input
                placeholder="Emergency contact name"
                value={createForm.emergencyContact}
                onChange={(e) => setCreateForm({ ...createForm, emergencyContact: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Phone</label>
              <Input
                placeholder="Emergency phone number"
                value={createForm.emergencyPhone}
                onChange={(e) => setCreateForm({ ...createForm, emergencyPhone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePatient}
              disabled={!createForm.fullName.trim() || creating}
            >
              {creating ? 'Registering...' : 'Register Patient'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Patient" size="lg">
        <div className="space-y-4">
          <Input label="Full Name" value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
            <Input label="Age" type="number" value={editForm.age} onChange={e => setEditForm({ ...editForm, age: e.target.value })} />
          </div>
          <Input label="Address" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
          <Input label="Woreda" value={editForm.woreda} onChange={e => setEditForm({ ...editForm, woreda: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Emergency Contact" value={editForm.emergencyContact} onChange={e => setEditForm({ ...editForm, emergencyContact: e.target.value })} />
            <Input label="Emergency Phone" value={editForm.emergencyPhone} onChange={e => setEditForm({ ...editForm, emergencyPhone: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleEditPatient} isLoading={editing}>Save Changes</Button>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Visit Modal */}
      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title={`Schedule Visit for ${selectedPatient?.fullName ?? ''}`} size="md">
        <div className="space-y-4">
          <Input label="Visit Date" type="datetime-local" value={scheduleForm.visitDate} onChange={e => setScheduleForm({ ...scheduleForm, visitDate: e.target.value })} />
          <Input label="Blood Pressure" placeholder="e.g. 120/80" value={scheduleForm.bloodPressure} onChange={e => setScheduleForm({ ...scheduleForm, bloodPressure: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Temperature (°C)" type="number" step="0.1" value={scheduleForm.temperature} onChange={e => setScheduleForm({ ...scheduleForm, temperature: e.target.value })} />
            <Input label="Weight (kg)" type="number" step="0.1" value={scheduleForm.weight} onChange={e => setScheduleForm({ ...scheduleForm, weight: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleScheduleVisit} isLoading={scheduling}>Schedule Visit</Button>
            <Button variant="ghost" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Visit Modal */}
      <Modal isOpen={showEditVisitModal} onClose={() => setShowEditVisitModal(false)} title="Edit Visit" size="md">
        <div className="space-y-4">
          <Input label="Visit Date" type="datetime-local" value={editVisitForm.visitDate} onChange={e => setEditVisitForm({ ...editVisitForm, visitDate: e.target.value })} />
          <Input label="Blood Pressure" placeholder="e.g. 120/80" value={editVisitForm.bloodPressure} onChange={e => setEditVisitForm({ ...editVisitForm, bloodPressure: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Temperature (°C)" type="number" step="0.1" value={editVisitForm.temperature} onChange={e => setEditVisitForm({ ...editVisitForm, temperature: e.target.value })} />
            <Input label="Weight (kg)" type="number" step="0.1" value={editVisitForm.weight} onChange={e => setEditVisitForm({ ...editVisitForm, weight: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleEditVisit} isLoading={editingVisit}>Save Changes</Button>
            <Button variant="ghost" onClick={() => setShowEditVisitModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}




