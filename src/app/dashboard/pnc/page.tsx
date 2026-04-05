'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, EmptyState } from '@/components/ui/LoadingState'
import { pncService, getCachedPatients, clearCache } from '@/services'
import { downloadCsv } from '@/lib/download'
import type { PNCVisit, Patient } from '@/services/types'
import { Plus, Search, Eye, Pencil, Trash2, HeartPulse, RefreshCcw, Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export default function PNCPage() {
  const { t } = useTranslation()
  const [visits, setVisits] = useState<PNCVisit[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedVisit, setSelectedVisit] = useState<PNCVisit | null>(null)
  const [editId, setEditId] = useState('')
  const [editForm, setEditForm] = useState({
    bloodPressure: '',
    temperature: '',
    babyBreathing: '',
    babyBreastFeeding: '',
    hivTested: '',
    remark: '',
  })
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    patientId: '',
    visitDate: '',
    bloodPressure: '',
    temperature: '',
    babyBreathing: '',
    babyBreastFeeding: '',
    hivTested: '',
    hivTestResult: '',
    remark: '',
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
        const allVisits: PNCVisit[] = []
        for (const p of patients.slice(0, 20)) {
          try {
            const vRes = await pncService.getByPatient(p.id)
            if (vRes.success && vRes.visits) allVisits.push(...vRes.visits)
          } catch {}
        }
        setVisits(allVisits)
      }
    } catch {}
    setLoading(false)
  }

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName ?? t("common.unknown")

  const resetForm = () => setForm({
    patientId: '',
    visitDate: '',
    bloodPressure: '',
    temperature: '',
    babyBreathing: '',
    babyBreastFeeding: '',
    hivTested: '',
    hivTestResult: '',
    remark: '',
  })

  const handleCreate = async () => {
    if (!form.patientId) return
    setSaving(true)
    try {
      await pncService.create({
        patientId: form.patientId,
        visitDate: form.visitDate || undefined,
        bloodPressure: form.bloodPressure || undefined,
        temperature: form.temperature ? parseFloat(form.temperature) : undefined,
        babyBreathing: form.babyBreathing || undefined,
        babyBreastFeeding: form.babyBreastFeeding || undefined,
        hivTested: form.hivTested || undefined,
        hivTestResult: form.hivTestResult || undefined,
        remark: form.remark || undefined,
      })
      setShowCreateModal(false)
      resetForm()
      loadData()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this PNC visit?')) return
    try {
      await pncService.delete(id)
      loadData()
    } catch {}
  }

  const openEditModal = (visit: PNCVisit) => {
    setEditId(visit.id)
    setEditForm({
      bloodPressure: visit.bloodPressure ?? '',
      temperature: visit.temperature != null ? String(visit.temperature) : '',
      babyBreathing: visit.babyBreathing ?? '',
      babyBreastFeeding: visit.babyBreastFeeding ?? '',
      hivTested: visit.hivTested ?? '',
      remark: String((visit as Record<string, unknown>).remark ?? ''),
    })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!editId) return
    setSaving(true)
    try {
      await pncService.update(editId, {
        bloodPressure: editForm.bloodPressure || undefined,
        temperature: editForm.temperature ? parseFloat(editForm.temperature) : undefined,
        babyBreathing: editForm.babyBreathing || undefined,
        babyBreastFeeding: editForm.babyBreastFeeding || undefined,
        hivTested: editForm.hivTested || undefined,
        remark: editForm.remark || undefined,
      })
      setShowEditModal(false)
      loadData()
    } catch {}
    setSaving(false)
  }

  const filtered = visits.filter(v =>
    getPatientName(v.patientId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title={t("appCopy.shell.pncTitle")} subtitle={t("appCopy.shell.pncSubtitle")}>
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
              const rows: Record<string, unknown>[] = filtered.map((v) => ({
                ...(JSON.parse(JSON.stringify(v)) as Record<string, unknown>),
                patientName: getPatientName(v.patientId),
              }))
              downloadCsv(`pnc-visits-${new Date().toISOString().slice(0, 10)}.csv`, rows)
            }}
          >
            <Download className="w-4 h-4" /> {t("common.export")}
          </Button>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" /> {t("appCopy.modal.newPncVisit")}
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingState message={t("appCopy.loading.pnc")} />
      ) : filtered.length === 0 ? (
        <EmptyState message={t("appCopy.empty.pnc")} />
      ) : (
        <div className="grid gap-4">
          {filtered.map(visit => (
            <Card key={visit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <HeartPulse className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{getPatientName(visit.patientId)}</h3>
                      <div className="flex gap-3 text-sm text-slate-500 mt-1">
                        {String((visit as Record<string, unknown>).visitDate ?? '') && <span>Visit: {formatDate(String((visit as Record<string, unknown>).visitDate))}</span>}
                        {visit.bloodPressure && <span>BP: {visit.bloodPressure}</span>}
                        {visit.temperature != null && <span>Temp: {visit.temperature}°C</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {visit.hivTested && <Badge variant={visit.hivTested === 'Yes' ? 'success' : 'default'} size="sm">HIV: {visit.hivTested}</Badge>}
                    <button onClick={() => { setSelectedVisit(visit); setShowDetailModal(true) }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => openEditModal(visit)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" aria-label="Edit visit">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(visit.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600">
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
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title={t("appCopy.modal.newPncVisit")} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("common.patient")}</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              <option value="">{t("common.patient")}...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Visit Date" type="date" value={form.visitDate} onChange={e => setForm({ ...form, visitDate: e.target.value })} />
            <Input label={t("appCopy.label.bloodPressure")} value={form.bloodPressure} onChange={e => setForm({ ...form, bloodPressure: e.target.value })} placeholder={t("appCopy.placeholder.bloodPressure")} />
          </div>
          <Input label={t("appCopy.label.temperatureCelsius")} type="number" value={form.temperature} onChange={e => setForm({ ...form, temperature: e.target.value })} placeholder={t("appCopy.placeholder.temperatureNum")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.babyBreathing")} value={form.babyBreathing} onChange={e => setForm({ ...form, babyBreathing: e.target.value })} placeholder={t("appCopy.placeholder.babyBreathing")} />
            <Input label={t("appCopy.label.babyBreastFeeding")} value={form.babyBreastFeeding} onChange={e => setForm({ ...form, babyBreastFeeding: e.target.value })} placeholder={t("appCopy.placeholder.babyBreastFeeding")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.hivTested")} value={form.hivTested} onChange={e => setForm({ ...form, hivTested: e.target.value })} placeholder={t("appCopy.placeholder.hivTested")} />
            <Input label={t("appCopy.label.hivTestResult")} value={form.hivTestResult} onChange={e => setForm({ ...form, hivTestResult: e.target.value })} placeholder={t("appCopy.placeholder.hivTestResult")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remark</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" value={form.remark} onChange={e => setForm({ ...form, remark: e.target.value })} placeholder="Additional notes..." />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleCreate} isLoading={saving}>{t("common.save")}</Button>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>{t("common.cancel")}</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={t("appCopy.modal.editPncVisit")} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.bloodPressure")} value={editForm.bloodPressure} onChange={e => setEditForm({ ...editForm, bloodPressure: e.target.value })} placeholder={t("appCopy.placeholder.bloodPressure")} />
            <Input label={t("appCopy.label.temperatureCelsius")} type="number" value={editForm.temperature} onChange={e => setEditForm({ ...editForm, temperature: e.target.value })} placeholder={t("appCopy.placeholder.temperatureNum")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t("appCopy.label.babyBreathing")} value={editForm.babyBreathing} onChange={e => setEditForm({ ...editForm, babyBreathing: e.target.value })} placeholder={t("appCopy.placeholder.babyBreathing")} />
            <Input label={t("appCopy.label.babyBreastFeeding")} value={editForm.babyBreastFeeding} onChange={e => setEditForm({ ...editForm, babyBreastFeeding: e.target.value })} placeholder={t("appCopy.placeholder.babyBreastFeeding")} />
          </div>
          <Input label={t("appCopy.label.hivTested")} value={editForm.hivTested} onChange={e => setEditForm({ ...editForm, hivTested: e.target.value })} placeholder={t("appCopy.placeholder.hivTested")} />
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remark</label>
            <textarea className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500" value={editForm.remark} onChange={e => setEditForm({ ...editForm, remark: e.target.value })} placeholder="Additional notes..." />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleUpdate} isLoading={saving}>{t("common.save")}</Button>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>{t("common.cancel")}</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={t("appCopy.modal.pncVisitDetails")} size="lg">
        {selectedVisit && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">{t("common.patient")}</p><p className="font-medium">{getPatientName(selectedVisit.patientId)}</p></div>
              <div><p className="text-xs text-slate-500">Visit Date</p><p className="font-medium">{(selectedVisit as Record<string, unknown>).visitDate ? formatDate((selectedVisit as Record<string, unknown>).visitDate as string) : t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.bloodPressure")}</p><p className="font-medium">{selectedVisit.bloodPressure ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.temperature")}</p><p className="font-medium">{selectedVisit.temperature != null ? `${selectedVisit.temperature}°C` : t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.babyBreathing")}</p><p className="font-medium">{selectedVisit.babyBreathing ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.babyBreastFeeding")}</p><p className="font-medium">{selectedVisit.babyBreastFeeding ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.hivTested")}</p><p className="font-medium">{selectedVisit.hivTested ?? t("common.na")}</p></div>
              <div><p className="text-xs text-slate-500">{t("appCopy.label.hivTestResult")}</p><p className="font-medium">{(selectedVisit as Record<string, unknown>).hivTestResult as string ?? t("common.na")}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-500">Remark</p><p className="font-medium">{(selectedVisit as Record<string, unknown>).remark as string ?? t("common.na")}</p></div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="secondary"
                onClick={() => {
                  openEditModal(selectedVisit)
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
