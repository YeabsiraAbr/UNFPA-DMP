'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, EmptyState } from '@/components/ui/LoadingState'
import { gbvScreeningService, getCachedPatients, clearCache } from '@/services'
import { downloadCsv } from '@/lib/download'
import type { GBVScreening, Patient } from '@/services/types'
import { Plus, Search, Eye, Pencil, Trash2, ShieldAlert, Lock, RefreshCcw, Download } from 'lucide-react'

export default function GBVScreeningPage() {
  const [records, setRecords] = useState<GBVScreening[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<GBVScreening | null>(null)
  const [editId, setEditId] = useState('')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    patientId: '',
    gbvHistory: '',
    temperature: '',
    weightKg: '',
    heightCm: '',
    bloodPressure: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    physicalExamination: '',
    workingDiagnosis: '',
    treatmentPlan: '',
    treatmentRx: '',
  })

  const [editForm, setEditForm] = useState({
    patientId: '',
    gbvHistory: '',
    temperature: '',
    weightKg: '',
    heightCm: '',
    bloodPressure: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    physicalExamination: '',
    workingDiagnosis: '',
    treatmentPlan: '',
    treatmentRx: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const patients = await getCachedPatients()
      if (patients.length) {
        setPatients(patients)
        const allRecords: GBVScreening[] = []
        for (const p of patients.slice(0, 20)) {
          try {
            const gRes = await gbvScreeningService.getByPatient(p.id)
            if (gRes.success && gRes.screenings) allRecords.push(...gRes.screenings)
          } catch {}
        }
        setRecords(allRecords)
      }
    } catch {}
    setLoading(false)
  }

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName ?? 'Unknown'

  const resetForm = () =>
    setForm({
      patientId: '',
      gbvHistory: '',
      temperature: '',
      weightKg: '',
      heightCm: '',
      bloodPressure: '',
      pulse: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      physicalExamination: '',
      workingDiagnosis: '',
      treatmentPlan: '',
      treatmentRx: '',
    })

  const resetEditForm = () =>
    setEditForm({
      patientId: '',
      gbvHistory: '',
      temperature: '',
      weightKg: '',
      heightCm: '',
      bloodPressure: '',
      pulse: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      physicalExamination: '',
      workingDiagnosis: '',
      treatmentPlan: '',
      treatmentRx: '',
    })

  const screeningToEditForm = (record: GBVScreening) => {
    const r = record as Record<string, unknown>
    return {
      patientId: record.patientId,
      gbvHistory: record.gbvHistory ?? '',
      temperature: record.temperature ?? '',
      weightKg: record.weightKg != null ? String(record.weightKg) : '',
      heightCm: record.heightCm != null ? String(record.heightCm) : '',
      bloodPressure: String(r.bloodPressure ?? ''),
      pulse: String(r.pulse ?? ''),
      respiratoryRate: String(r.respiratoryRate ?? ''),
      oxygenSaturation: String(r.oxygenSaturation ?? ''),
      physicalExamination: String(r.physicalExamination ?? ''),
      workingDiagnosis: record.workingDiagnosis ?? '',
      treatmentPlan: record.treatmentPlan ?? '',
      treatmentRx: String(r.treatmentRx ?? ''),
    }
  }

  const handleCreate = async () => {
    if (!form.patientId) return
    setSaving(true)
    try {
      await gbvScreeningService.create({
        patientId: form.patientId,
        gbvHistory: form.gbvHistory || undefined,
        temperature: form.temperature || undefined,
        weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
        heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
        bloodPressure: form.bloodPressure || undefined,
        pulse: form.pulse || undefined,
        respiratoryRate: form.respiratoryRate || undefined,
        oxygenSaturation: form.oxygenSaturation || undefined,
        physicalExamination: form.physicalExamination || undefined,
        workingDiagnosis: form.workingDiagnosis || undefined,
        treatmentPlan: form.treatmentPlan || undefined,
        treatmentRx: form.treatmentRx || undefined,
      })
      setShowCreateModal(false)
      resetForm()
      loadData()
    } catch {}
    setSaving(false)
  }

  const handleUpdate = async () => {
    if (!editId) return
    setSaving(true)
    try {
      await gbvScreeningService.update(editId, {
        gbvHistory: editForm.gbvHistory || undefined,
        temperature: editForm.temperature || undefined,
        weightKg: editForm.weightKg ? parseFloat(editForm.weightKg) : undefined,
        heightCm: editForm.heightCm ? parseFloat(editForm.heightCm) : undefined,
        bloodPressure: editForm.bloodPressure || undefined,
        pulse: editForm.pulse || undefined,
        respiratoryRate: editForm.respiratoryRate || undefined,
        oxygenSaturation: editForm.oxygenSaturation || undefined,
        physicalExamination: editForm.physicalExamination || undefined,
        workingDiagnosis: editForm.workingDiagnosis || undefined,
        treatmentPlan: editForm.treatmentPlan || undefined,
        treatmentRx: editForm.treatmentRx || undefined,
      })
      setShowEditModal(false)
      setEditId('')
      resetEditForm()
      loadData()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this GBV screening record?')) return
    try {
      await gbvScreeningService.delete(id)
      loadData()
    } catch {}
  }

  const filtered = records.filter(r =>
    getPatientName(r.patientId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="GBV Screening" subtitle="Gender-Based Violence screening and clinical registration">
      {/* Security Notice */}
      <Card className="mb-6 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-200 dark:bg-amber-800">
              <Lock className="w-5 h-5 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                Restricted Access Module
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                GBV data is encrypted and access is logged. Only authorized personnel can view case details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder="Search by patient name..." icon={Search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { clearCache('patients-list'); loadData() }} disabled={loading}>
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            disabled={!filtered.length}
            onClick={() => {
              const rows: Record<string, unknown>[] = filtered.map((r) => ({
                ...(JSON.parse(JSON.stringify(r)) as Record<string, unknown>),
                patientName: getPatientName(r.patientId),
              }))
              downloadCsv(`gbv-screening-${new Date().toISOString().slice(0, 10)}.csv`, rows)
            }}
          >
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" /> New GBV Screening
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading GBV screening records..." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No GBV screening records found" />
      ) : (
        <div className="grid gap-4">
          {filtered.map(record => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{getPatientName(record.patientId)}</h3>
                      <div className="flex gap-3 text-sm text-slate-500 mt-1">
                        {record.workingDiagnosis && <span>Dx: {record.workingDiagnosis}</span>}
                        {record.treatmentPlan && <span>Plan: {record.treatmentPlan}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSelectedRecord(record); setShowDetailModal(true) }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(record.id)
                        setEditForm(screeningToEditForm(record))
                        setShowEditModal(true)
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(record.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New GBV Screening" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select a patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GBV History</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={form.gbvHistory} onChange={e => setForm({ ...form, gbvHistory: e.target.value })} placeholder="Document GBV history..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Temperature" value={form.temperature} onChange={e => setForm({ ...form, temperature: e.target.value })} placeholder="e.g. 36.5°C" />
            <Input label="Weight (kg)" type="number" value={form.weightKg} onChange={e => setForm({ ...form, weightKg: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Height (cm)" type="number" value={form.heightCm} onChange={e => setForm({ ...form, heightCm: e.target.value })} />
            <Input label="Blood Pressure" value={form.bloodPressure} onChange={e => setForm({ ...form, bloodPressure: e.target.value })} placeholder="e.g. 120/80" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pulse" value={form.pulse} onChange={e => setForm({ ...form, pulse: e.target.value })} placeholder="e.g. 72 bpm" />
            <Input label="Respiratory Rate" value={form.respiratoryRate} onChange={e => setForm({ ...form, respiratoryRate: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Oxygen Saturation" value={form.oxygenSaturation} onChange={e => setForm({ ...form, oxygenSaturation: e.target.value })} placeholder="e.g. 98%" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Physical Examination</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={form.physicalExamination} onChange={e => setForm({ ...form, physicalExamination: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Working Diagnosis</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={form.workingDiagnosis} onChange={e => setForm({ ...form, workingDiagnosis: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Treatment Plan</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={form.treatmentPlan} onChange={e => setForm({ ...form, treatmentPlan: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Treatment Rx</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={form.treatmentRx} onChange={e => setForm({ ...form, treatmentRx: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleCreate} isLoading={saving}>Create Screening</Button>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="GBV Screening Details" size="lg">
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">Patient</p><p className="font-medium">{getPatientName(selectedRecord.patientId)}</p></div>
              <div><p className="text-xs text-slate-500">GBV History</p><p className="font-medium">{selectedRecord.gbvHistory ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Temperature</p><p className="font-medium">{selectedRecord.temperature ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Weight (kg)</p><p className="font-medium">{selectedRecord.weightKg ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Height (cm)</p><p className="font-medium">{selectedRecord.heightCm ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">BMI</p><p className="font-medium">{selectedRecord.bmiIndex ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Blood Pressure</p><p className="font-medium">{(selectedRecord as any).bloodPressure ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Pulse</p><p className="font-medium">{(selectedRecord as any).pulse ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Respiratory Rate</p><p className="font-medium">{(selectedRecord as any).respiratoryRate ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Oxygen Saturation</p><p className="font-medium">{(selectedRecord as any).oxygenSaturation ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Physical Examination</p><p className="font-medium">{(selectedRecord as any).physicalExamination ?? 'N/A'}</p></div>
            </div>
            <div>
              <p className="text-xs text-slate-500">Working Diagnosis</p>
              <p className="font-medium mt-1">{selectedRecord.workingDiagnosis ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Treatment Plan</p>
              <p className="font-medium mt-1">{selectedRecord.treatmentPlan ?? 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Treatment Rx</p>
              <p className="font-medium mt-1">{(selectedRecord as any).treatmentRx ?? 'N/A'}</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="primary"
                onClick={() => {
                  setEditId(selectedRecord.id)
                  setEditForm(screeningToEditForm(selectedRecord))
                  setShowDetailModal(false)
                  setShowEditModal(true)
                }}
              >
                <Pencil className="w-4 h-4" /> Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditId('')
          resetEditForm()
        }}
        title="Edit GBV Screening"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={editForm.patientId} onChange={e => setEditForm({ ...editForm, patientId: e.target.value })}>
              <option value="">Select a patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">GBV History</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={editForm.gbvHistory} onChange={e => setEditForm({ ...editForm, gbvHistory: e.target.value })} placeholder="Document GBV history..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Temperature" value={editForm.temperature} onChange={e => setEditForm({ ...editForm, temperature: e.target.value })} placeholder="e.g. 36.5°C" />
            <Input label="Weight (kg)" type="number" value={editForm.weightKg} onChange={e => setEditForm({ ...editForm, weightKg: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Height (cm)" type="number" value={editForm.heightCm} onChange={e => setEditForm({ ...editForm, heightCm: e.target.value })} />
            <Input label="Blood Pressure" value={editForm.bloodPressure} onChange={e => setEditForm({ ...editForm, bloodPressure: e.target.value })} placeholder="e.g. 120/80" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pulse" value={editForm.pulse} onChange={e => setEditForm({ ...editForm, pulse: e.target.value })} placeholder="e.g. 72 bpm" />
            <Input label="Respiratory Rate" value={editForm.respiratoryRate} onChange={e => setEditForm({ ...editForm, respiratoryRate: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Oxygen Saturation" value={editForm.oxygenSaturation} onChange={e => setEditForm({ ...editForm, oxygenSaturation: e.target.value })} placeholder="e.g. 98%" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Physical Examination</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={editForm.physicalExamination} onChange={e => setEditForm({ ...editForm, physicalExamination: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Working Diagnosis</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={editForm.workingDiagnosis} onChange={e => setEditForm({ ...editForm, workingDiagnosis: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Treatment Plan</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={editForm.treatmentPlan} onChange={e => setEditForm({ ...editForm, treatmentPlan: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Treatment Rx</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={editForm.treatmentRx} onChange={e => setEditForm({ ...editForm, treatmentRx: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleUpdate} isLoading={saving}>Save Changes</Button>
            <Button variant="ghost" onClick={() => { setShowEditModal(false); setEditId(''); resetEditForm() }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
