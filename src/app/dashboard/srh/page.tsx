'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, EmptyState } from '@/components/ui/LoadingState'
import { srhService, getCachedPatients, clearCache } from '@/services'
import { downloadCsv } from '@/lib/download'
import type { SRHRegistration, Patient } from '@/services/types'
import { Plus, Search, Eye, Pencil, Trash2, Heart, RefreshCcw, Download } from 'lucide-react'

const SRH_SERVICE_TYPES = ['Family Planning', 'Routine Care', 'STI/HIV', 'Others'] as const

export default function SRHPage() {
  const { t } = useTranslation()
  const [records, setRecords] = useState<SRHRegistration[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<SRHRegistration | null>(null)
  const [editId, setEditId] = useState('')
  const [editForm, setEditForm] = useState({
    srhServiceType: '',
    temperature: '',
    weightKg: '',
    heightCm: '',
    bloodPressure: '',
    pulse: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    workingDiagnosis: '',
    treatmentPlan: '',
  })
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    patientId: '',
    srhServiceType: '',
    history: '',
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
        const allRecords: SRHRegistration[] = []
        for (const p of patients.slice(0, 20)) {
          try {
            const sRes = await srhService.getByPatient(p.id)
            if (sRes.success && sRes.registrations) allRecords.push(...sRes.registrations)
          } catch {}
        }
        setRecords(allRecords)
      }
    } catch {}
    setLoading(false)
  }

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName ?? t("common.unknown")

  const resetForm = () =>
    setForm({
      patientId: '',
      srhServiceType: '',
      history: '',
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

  const handleCreate = async () => {
    if (!form.patientId) return
    setSaving(true)
    try {
      await srhService.create({
        patientId: form.patientId,
        srhServiceType: form.srhServiceType || undefined,
        history: form.history || undefined,
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this SRH record?')) return
    try {
      await srhService.delete(id)
      loadData()
    } catch {}
  }

  const openEditModal = (record: SRHRegistration) => {
    setEditId(record.id)
    setEditForm({
      srhServiceType: String((record as Record<string, unknown>).srhServiceType ?? ''),
      temperature: record.temperature ?? '',
      weightKg: record.weightKg != null ? String(record.weightKg) : '',
      heightCm: record.heightCm != null ? String(record.heightCm) : '',
      bloodPressure: String((record as Record<string, unknown>).bloodPressure ?? ''),
      pulse: String((record as Record<string, unknown>).pulse ?? ''),
      respiratoryRate: String((record as Record<string, unknown>).respiratoryRate ?? ''),
      oxygenSaturation: String((record as Record<string, unknown>).oxygenSaturation ?? ''),
      workingDiagnosis: record.workingDiagnosis ?? '',
      treatmentPlan: record.treatmentPlan ?? '',
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editId) return
    setSaving(true)
    try {
      await srhService.update(editId, {
        srhServiceType: editForm.srhServiceType || undefined,
        temperature: editForm.temperature || undefined,
        weightKg: editForm.weightKg ? parseFloat(editForm.weightKg) : undefined,
        heightCm: editForm.heightCm ? parseFloat(editForm.heightCm) : undefined,
        bloodPressure: editForm.bloodPressure || undefined,
        pulse: editForm.pulse || undefined,
        respiratoryRate: editForm.respiratoryRate || undefined,
        oxygenSaturation: editForm.oxygenSaturation || undefined,
        workingDiagnosis: editForm.workingDiagnosis || undefined,
        treatmentPlan: editForm.treatmentPlan || undefined,
      })
      setShowEditModal(false)
      loadData()
    } catch {}
    setSaving(false)
  }

  const filtered = records.filter(r =>
    getPatientName(r.patientId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title={t("appCopy.shell.srhTitle")} subtitle={t("appCopy.shell.srhSubtitle")}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder={t("appCopy.search.patientName")} icon={Search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { clearCache('patients-list'); loadData() }} disabled={loading}>
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t("common.refresh")}
          </Button>
          <Button
            variant="outline"
            disabled={!filtered.length}
            onClick={() => {
              const rows: Record<string, unknown>[] = filtered.map((r) => ({
                ...(JSON.parse(JSON.stringify(r)) as Record<string, unknown>),
                patientName: getPatientName(r.patientId),
              }))
              downloadCsv(`srh-registrations-${new Date().toISOString().slice(0, 10)}.csv`, rows)
            }}
          >
            <Download className="w-4 h-4" /> {t("common.export")}
          </Button>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" /> {t("appCopy.modal.newSrhRecord")}
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState message={t("appCopy.loading.srh")} />
      ) : filtered.length === 0 ? (
        <EmptyState message={t("appCopy.empty.srh")} />
      ) : (
        <div className="grid gap-4">
          {filtered.map(record => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{getPatientName(record.patientId)}</h3>
                      <div className="flex gap-3 text-sm text-slate-500 mt-1">
                        {(record as any).srhServiceType && <span>{(record as any).srhServiceType}</span>}
                        {record.workingDiagnosis && <span>Dx: {record.workingDiagnosis}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSelectedRecord(record); setShowDetailModal(true) }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => openEditModal(record)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" aria-label="Edit record">
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
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={t("appCopy.modal.newSrhRecord")} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("common.patient")}</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select a patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Type</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.srhServiceType} onChange={e => setForm({ ...form, srhServiceType: e.target.value })}>
              <option value="">Select service type...</option>
              {SRH_SERVICE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.temperature")} value={form.temperature} onChange={e => setForm({ ...form, temperature: e.target.value })} placeholder="e.g. 36.5°C" />
            <Input label="Weight (kg)" type="number" value={form.weightKg} onChange={e => setForm({ ...form, weightKg: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Height (cm)" type="number" value={form.heightCm} onChange={e => setForm({ ...form, heightCm: e.target.value })} />
            <Input label={t("appCopy.label.bloodPressure")} value={form.bloodPressure} onChange={e => setForm({ ...form, bloodPressure: e.target.value })} placeholder="e.g. 120/80" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pulse" value={form.pulse} onChange={e => setForm({ ...form, pulse: e.target.value })} placeholder="e.g. 72 bpm" />
            <Input label="Respiratory Rate" value={form.respiratoryRate} onChange={e => setForm({ ...form, respiratoryRate: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.oxygenSaturation")} value={form.oxygenSaturation} onChange={e => setForm({ ...form, oxygenSaturation: e.target.value })} placeholder="e.g. 98%" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Working Diagnosis</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={form.workingDiagnosis} onChange={e => setForm({ ...form, workingDiagnosis: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Treatment Plan</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={form.treatmentPlan} onChange={e => setForm({ ...form, treatmentPlan: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleCreate} isLoading={saving}>Create Record</Button>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>{t("common.cancel")}</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={t("appCopy.modal.editSrhRecord")} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Type</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={editForm.srhServiceType} onChange={e => setEditForm({ ...editForm, srhServiceType: e.target.value })}>
              <option value="">Select service type...</option>
              {SRH_SERVICE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.temperature")} value={editForm.temperature} onChange={e => setEditForm({ ...editForm, temperature: e.target.value })} placeholder="e.g. 36.5°C" />
            <Input label="Weight (kg)" type="number" value={editForm.weightKg} onChange={e => setEditForm({ ...editForm, weightKg: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Height (cm)" type="number" value={editForm.heightCm} onChange={e => setEditForm({ ...editForm, heightCm: e.target.value })} />
            <Input label={t("appCopy.label.bloodPressure")} value={editForm.bloodPressure} onChange={e => setEditForm({ ...editForm, bloodPressure: e.target.value })} placeholder="e.g. 120/80" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pulse" value={editForm.pulse} onChange={e => setEditForm({ ...editForm, pulse: e.target.value })} placeholder="e.g. 72 bpm" />
            <Input label="Respiratory Rate" value={editForm.respiratoryRate} onChange={e => setEditForm({ ...editForm, respiratoryRate: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.oxygenSaturation")} value={editForm.oxygenSaturation} onChange={e => setEditForm({ ...editForm, oxygenSaturation: e.target.value })} placeholder="e.g. 98%" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Working Diagnosis</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={editForm.workingDiagnosis} onChange={e => setEditForm({ ...editForm, workingDiagnosis: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Treatment Plan</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px]" value={editForm.treatmentPlan} onChange={e => setEditForm({ ...editForm, treatmentPlan: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleUpdate} isLoading={saving}>{t("common.save")}</Button>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>{t("common.cancel")}</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={t("appCopy.modal.srhRecordDetails")} size="lg">
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">{t("common.patient")}</p><p className="font-medium">{getPatientName(selectedRecord.patientId)}</p></div>
              <div><p className="text-xs text-slate-500">Service Type</p><p className="font-medium">{(selectedRecord as any).srhServiceType ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">History</p><p className="font-medium">{selectedRecord.history ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.temperature")}</p><p className="font-medium">{selectedRecord.temperature ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">Weight (kg)</p><p className="font-medium">{selectedRecord.weightKg ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">Height (cm)</p><p className="font-medium">{selectedRecord.heightCm ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">BMI</p><p className="font-medium">{selectedRecord.bmiIndex ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.bloodPressure")}</p><p className="font-medium">{(selectedRecord as any).bloodPressure ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">Pulse</p><p className="font-medium">{(selectedRecord as any).pulse ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">Respiratory Rate</p><p className="font-medium">{(selectedRecord as any).respiratoryRate ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.oxygenSaturation")}</p><p className="font-medium">{(selectedRecord as any).oxygenSaturation ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">Physical Examination</p><p className="font-medium">{(selectedRecord as any).physicalExamination ?? t("common.na")}</p></div>
            </div>
            <div>
              <p className="text-xs text-slate-500">Working Diagnosis</p>
              <p className="font-medium mt-1">{selectedRecord.workingDiagnosis ?? t("common.na")}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Treatment Plan</p>
              <p className="font-medium mt-1">{selectedRecord.treatmentPlan ?? t("common.na")}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Treatment Rx</p>
              <p className="font-medium mt-1">{(selectedRecord as any).treatmentRx ?? t("common.na")}</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="secondary"
                onClick={() => {
                  openEditModal(selectedRecord)
                  setShowDetailModal(false)
                }}
              >
                <Pencil className="w-4 h-4" /> {t("common.edit")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
