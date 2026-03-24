'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, EmptyState } from '@/components/ui/LoadingState'
import { ancService, patientService } from '@/services'
import type { ANCRecord, Patient } from '@/services/types'
import { Plus, Search, Eye, Pencil, Trash2, Baby } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ANCPage() {
  const [records, setRecords] = useState<ANCRecord[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<ANCRecord | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    patientId: '',
    lmp: '',
    edd: '',
    gravida: '',
    para: '',
    hiv: '',
    bloodGroupRh: '',
    diabetesMellitus: false,
  })

  const [editForm, setEditForm] = useState({
    patientId: '',
    lmp: '',
    edd: '',
    gravida: '',
    para: '',
    hiv: '',
    bloodGroupRh: '',
    diabetesMellitus: false,
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
        const allRecords: ANCRecord[] = []
        for (const p of pRes.patients.slice(0, 20)) {
          try {
            const aRes = await ancService.getByPatient(p.id)
            if (aRes.success && aRes.records) allRecords.push(...aRes.records)
          } catch {}
        }
        setRecords(allRecords)
      }
    } catch {}
    setLoading(false)
  }

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName ?? 'Unknown'

  const handleCreate = async () => {
    if (!form.patientId) return
    setSaving(true)
    try {
      await ancService.create({
        patientId: form.patientId,
        lmp: form.lmp || undefined,
        edd: form.edd || undefined,
        gravida: form.gravida ? parseInt(form.gravida) : undefined,
        para: form.para ? parseInt(form.para) : undefined,
        hiv: form.hiv || undefined,
        bloodGroupRh: form.bloodGroupRh || undefined,
        diabetesMellitus: form.diabetesMellitus,
      })
      setShowCreateModal(false)
      setForm({ patientId: '', lmp: '', edd: '', gravida: '', para: '', hiv: '', bloodGroupRh: '', diabetesMellitus: false })
      loadData()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ANC record?')) return
    try {
      await ancService.delete(id)
      loadData()
    } catch {}
  }

  const ancRecordToEditForm = (r: ANCRecord) => ({
    patientId: r.patientId,
    lmp: r.lmp ?? '',
    edd: r.edd ?? '',
    gravida: r.gravida != null ? String(r.gravida) : '',
    para: r.para != null ? String(r.para) : '',
    hiv: r.hiv ?? '',
    bloodGroupRh: r.bloodGroupRh ?? '',
    diabetesMellitus: r.diabetesMellitus ?? false,
  })

  const handleUpdate = async () => {
    if (!editId) return
    setSaving(true)
    try {
      await ancService.update(editId, {
        lmp: editForm.lmp || undefined,
        edd: editForm.edd || undefined,
        gravida: editForm.gravida ? parseInt(editForm.gravida, 10) : undefined,
        para: editForm.para ? parseInt(editForm.para, 10) : undefined,
        hiv: editForm.hiv || undefined,
        bloodGroupRh: editForm.bloodGroupRh || undefined,
        diabetesMellitus: editForm.diabetesMellitus,
      })
      setShowEditModal(false)
      setEditId(null)
      setEditForm({ patientId: '', lmp: '', edd: '', gravida: '', para: '', hiv: '', bloodGroupRh: '', diabetesMellitus: false })
      loadData()
    } catch {}
    setSaving(false)
  }

  const openEditFromRecord = (r: ANCRecord) => {
    setEditId(r.id)
    setEditForm(ancRecordToEditForm(r))
    setShowDetailModal(false)
    setShowEditModal(true)
  }

  const filtered = records.filter(r =>
    getPatientName(r.patientId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="ANC Records" subtitle="Antenatal Care record management">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder="Search by patient name..." icon={Search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" /> New ANC Record
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Loading ANC records..." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No ANC records found" />
      ) : (
        <div className="grid gap-4">
          {filtered.map(record => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <Baby className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{getPatientName(record.patientId)}</h3>
                      <div className="flex gap-3 text-sm text-slate-500 mt-1">
                        {record.lmp && <span>LMP: {record.lmp}</span>}
                        {record.edd && <span>EDD: {record.edd}</span>}
                        {record.gravida != null && <span>G{record.gravida}P{record.para ?? 0}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.hiv && <Badge variant={record.hiv === 'Positive' ? 'danger' : 'success'} size="sm">{record.hiv}</Badge>}
                    <button onClick={() => { setSelectedRecord(record); setShowDetailModal(true) }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(record.id)
                        setEditForm(ancRecordToEditForm(record))
                        setShowEditModal(true)
                      }}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
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
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New ANC Record" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select a patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="LMP (Last Menstrual Period)" type="date" value={form.lmp} onChange={e => setForm({ ...form, lmp: e.target.value })} />
            <Input label="EDD (Expected Due Date)" type="date" value={form.edd} onChange={e => setForm({ ...form, edd: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Gravida" type="number" value={form.gravida} onChange={e => setForm({ ...form, gravida: e.target.value })} />
            <Input label="Para" type="number" value={form.para} onChange={e => setForm({ ...form, para: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="HIV Status" value={form.hiv} onChange={e => setForm({ ...form, hiv: e.target.value })} placeholder="e.g. Negative" />
            <Input label="Blood Group & Rh" value={form.bloodGroupRh} onChange={e => setForm({ ...form, bloodGroupRh: e.target.value })} placeholder="e.g. O+" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={form.diabetesMellitus} onChange={e => setForm({ ...form, diabetesMellitus: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">Diabetes Mellitus</span>
          </label>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleCreate} isLoading={saving}>Create Record</Button>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditId(null)
        }}
        title="Edit ANC Record"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
            <select
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 text-sm cursor-not-allowed"
              value={editForm.patientId}
              disabled
            >
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="LMP (Last Menstrual Period)" type="date" value={editForm.lmp} onChange={e => setEditForm({ ...editForm, lmp: e.target.value })} />
            <Input label="EDD (Expected Due Date)" type="date" value={editForm.edd} onChange={e => setEditForm({ ...editForm, edd: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Gravida" type="number" value={editForm.gravida} onChange={e => setEditForm({ ...editForm, gravida: e.target.value })} />
            <Input label="Para" type="number" value={editForm.para} onChange={e => setEditForm({ ...editForm, para: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="HIV Status" value={editForm.hiv} onChange={e => setEditForm({ ...editForm, hiv: e.target.value })} placeholder="e.g. Negative" />
            <Input label="Blood Group & Rh" value={editForm.bloodGroupRh} onChange={e => setEditForm({ ...editForm, bloodGroupRh: e.target.value })} placeholder="e.g. O+" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={editForm.diabetesMellitus} onChange={e => setEditForm({ ...editForm, diabetesMellitus: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">Diabetes Mellitus</span>
          </label>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleUpdate} isLoading={saving}>Save Changes</Button>
            <Button variant="ghost" onClick={() => { setShowEditModal(false); setEditId(null) }}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="ANC Record Details" size="lg">
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">Patient</p><p className="font-medium">{getPatientName(selectedRecord.patientId)}</p></div>
              <div><p className="text-xs text-slate-500">LMP</p><p className="font-medium">{selectedRecord.lmp ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">EDD</p><p className="font-medium">{selectedRecord.edd ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">G/P</p><p className="font-medium">G{selectedRecord.gravida ?? '-'}P{selectedRecord.para ?? '-'}</p></div>
              <div><p className="text-xs text-slate-500">HIV</p><p className="font-medium">{selectedRecord.hiv ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Blood Group</p><p className="font-medium">{selectedRecord.bloodGroupRh ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Diabetes</p><p className="font-medium">{selectedRecord.diabetesMellitus ? 'Yes' : 'No'}</p></div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="primary" onClick={() => openEditFromRecord(selectedRecord)}>
                <Pencil className="w-4 h-4" /> Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}
