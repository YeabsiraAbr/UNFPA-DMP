'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, EmptyState } from '@/components/ui/LoadingState'
import { gbvReportService, patientService } from '@/services'
import type { GBVReport, Patient } from '@/services/types'
import { Plus, Search, Eye, Edit, Trash2, Shield, Lock, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function GBVPage() {
  const [reports, setReports] = useState<GBVReport[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<GBVReport | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [createForm, setCreateForm] = useState({
    patientId: '',
    incidentDate: '',
    referral: false,
    referralInfo: '',
    highRisk: false,
    attachment: null as File | null,
  })

  const [editForm, setEditForm] = useState({
    incidentDate: '',
    referral: false,
    referralInfo: '',
    highRisk: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const pRes = await patientService.getAll()
      if (pRes.success && pRes.patients) {
        setPatients(pRes.patients)
        const allReports: GBVReport[] = []
        for (const p of pRes.patients.slice(0, 20)) {
          try {
            const gRes = await gbvReportService.getByPatient(p.id)
            if (gRes.success && gRes.reports) allReports.push(...gRes.reports)
          } catch {}
        }
        setReports(allReports)
      }
    } catch {}
    setLoading(false)
  }

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName ?? 'Unknown'

  const resetCreateForm = () => {
    setCreateForm({ patientId: '', incidentDate: '', referral: false, referralInfo: '', highRisk: false, attachment: null })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCreate = async () => {
    if (!createForm.patientId) return
    setSaving(true)
    try {
      await gbvReportService.create({
        patientId: createForm.patientId,
        incidentDate: createForm.incidentDate || undefined,
        referral: createForm.referral,
        referralInfo: createForm.referralInfo || undefined,
        highRisk: createForm.highRisk,
        attachment: createForm.attachment ?? undefined,
      })
      setShowCreateModal(false)
      resetCreateForm()
      loadData()
    } catch {}
    setSaving(false)
  }

  const openEdit = (report: GBVReport) => {
    setEditForm({
      incidentDate: report.incidentDate ?? '',
      referral: report.referral ?? false,
      referralInfo: report.referralInfo ?? '',
      highRisk: report.highRisk ?? false,
    })
    setShowDetailModal(false)
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    if (!selectedReport) return
    setSaving(true)
    try {
      await gbvReportService.update(selectedReport.id, {
        incidentDate: editForm.incidentDate || undefined,
        referral: editForm.referral,
        referralInfo: editForm.referralInfo || undefined,
        highRisk: editForm.highRisk,
      })
      setShowEditModal(false)
      loadData()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this GBV report? This action cannot be undone.')) return
    try {
      await gbvReportService.delete(id)
      setShowDetailModal(false)
      loadData()
    } catch {}
  }

  const filtered = reports.filter(r =>
    getPatientName(r.patientId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="GBV Reports" subtitle="Secure gender-based violence case management">
      {/* Restricted Access Warning */}
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
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" /> New Case Intake
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Loading GBV reports..." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No GBV reports found" />
      ) : (
        <div className="grid gap-4">
          {filtered.map(report => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{getPatientName(report.patientId)}</h3>
                      <div className="flex gap-3 text-sm text-slate-500 mt-1">
                        {report.incidentDate && <span>Incident: {formatDate(report.incidentDate)}</span>}
                        <span>{report.referral ? 'Referred' : 'No referral'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.highRisk && (
                      <Badge variant="danger" size="sm">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        High Risk
                      </Badge>
                    )}
                    {report.referral && <Badge variant="info" size="sm">Referred</Badge>}
                    <button onClick={() => { setSelectedReport(report); setShowDetailModal(true) }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(report.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-600">
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
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetCreateForm() }} title="New Case Intake" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={createForm.patientId} onChange={e => setCreateForm({ ...createForm, patientId: e.target.value })}>
              <option value="">Select a patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <Input label="Incident Date" type="date" value={createForm.incidentDate} onChange={e => setCreateForm({ ...createForm, incidentDate: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={createForm.referral} onChange={e => setCreateForm({ ...createForm, referral: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">Referral</span>
          </label>
          {createForm.referral && (
            <Input label="Referral Information" value={createForm.referralInfo} onChange={e => setCreateForm({ ...createForm, referralInfo: e.target.value })} placeholder="Referral details..." />
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={createForm.highRisk} onChange={e => setCreateForm({ ...createForm, highRisk: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">High Risk</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Attachment</label>
            <input
              ref={fileInputRef}
              type="file"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/30 dark:file:text-brand-300"
              onChange={e => setCreateForm({ ...createForm, attachment: e.target.files?.[0] ?? null })}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleCreate} isLoading={saving}>Create Report</Button>
            <Button variant="ghost" onClick={() => { setShowCreateModal(false); resetCreateForm() }}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="GBV Report Details" size="lg">
        {selectedReport && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-700 dark:text-amber-400">
                Confidential case data. Access is being logged.
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">Patient</p><p className="font-medium">{getPatientName(selectedReport.patientId)}</p></div>
              <div><p className="text-xs text-slate-500">Incident Date</p><p className="font-medium">{selectedReport.incidentDate ? formatDate(selectedReport.incidentDate) : 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Referral</p><p className="font-medium">{selectedReport.referral ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-slate-500">Referral Info</p><p className="font-medium">{selectedReport.referralInfo ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">High Risk</p><p className="font-medium">{selectedReport.highRisk ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-slate-500">Attachment</p><p className="font-medium">{selectedReport.attachment ? 'Uploaded' : 'None'}</p></div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="primary" onClick={() => openEdit(selectedReport)}>
                <Edit className="w-4 h-4" /> Update Case
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(selectedReport.id)}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Update GBV Report" size="lg">
        <div className="space-y-4">
          <Input label="Incident Date" type="date" value={editForm.incidentDate} onChange={e => setEditForm({ ...editForm, incidentDate: e.target.value })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={editForm.referral} onChange={e => setEditForm({ ...editForm, referral: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">Referral</span>
          </label>
          {editForm.referral && (
            <Input label="Referral Information" value={editForm.referralInfo} onChange={e => setEditForm({ ...editForm, referralInfo: e.target.value })} placeholder="Referral details..." />
          )}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={editForm.highRisk} onChange={e => setEditForm({ ...editForm, highRisk: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">High Risk</span>
          </label>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleUpdate} isLoading={saving}>Save Changes</Button>
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
