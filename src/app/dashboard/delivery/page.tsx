'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, EmptyState } from '@/components/ui/LoadingState'
import { deliveryService, getCachedPatients } from '@/services'
import type { Delivery, Patient } from '@/services/types'
import { Plus, Search, Eye, Pencil, Trash2, Stethoscope } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function DeliveryPage() {
  const [records, setRecords] = useState<Delivery[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<Delivery | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    patientId: '',
    deliveryDate: '',
    deliveryTime: '',
    referral: false,
    referralInfo: '',
    amtsl: '' as '' | 'Ergometrine' | 'Oxytocin' | 'Misoprostol',
    placenta: '' as '' | 'Completed' | 'Incomplete' | 'CCT' | 'MRP' | 'NRP',
    laceration: '' as '' | '1st Degree' | '2nd Degree' | '3rd Degree',
    obstetricCxManaged: false,
    aphManaged: false,
    pphManaged: false,
    eclampsiaManaged: false,
    newbornSex: '' as '' | 'Male' | 'Female',
    newbornTermStatus: '' as '' | 'Term' | 'Preterm',
    newbornAlive: true,
    newbornApgarScore: '',
    newbornBirthWeightGm: '',
    newbornLengthCm: '',
  })

  const [editForm, setEditForm] = useState({
    patientId: '',
    deliveryDate: '',
    deliveryTime: '',
    referral: false,
    referralInfo: '',
    amtsl: '' as '' | 'Ergometrine' | 'Oxytocin' | 'Misoprostol',
    placenta: '' as '' | 'Completed' | 'Incomplete' | 'CCT' | 'MRP' | 'NRP',
    laceration: '' as '' | '1st Degree' | '2nd Degree' | '3rd Degree',
    obstetricCxManaged: false,
    aphManaged: false,
    pphManaged: false,
    eclampsiaManaged: false,
    newbornSex: '' as '' | 'Male' | 'Female',
    newbornTermStatus: '' as '' | 'Term' | 'Preterm',
    newbornAlive: true,
    newbornApgarScore: '',
    newbornBirthWeightGm: '',
    newbornLengthCm: '',
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
        const allRecords: Delivery[] = []
        for (const p of patients.slice(0, 20)) {
          try {
            const dRes = await deliveryService.getByPatient(p.id)
            if (dRes.success && dRes.deliveries) allRecords.push(...dRes.deliveries)
          } catch {}
        }
        setRecords(allRecords)
      }
    } catch {}
    setLoading(false)
  }

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.fullName ?? 'Unknown'

  const resetForm = () => setForm({
    patientId: '',
    deliveryDate: '',
    deliveryTime: '',
    referral: false,
    referralInfo: '',
    amtsl: '',
    placenta: '',
    laceration: '',
    obstetricCxManaged: false,
    aphManaged: false,
    pphManaged: false,
    eclampsiaManaged: false,
    newbornSex: '',
    newbornTermStatus: '',
    newbornAlive: true,
    newbornApgarScore: '',
    newbornBirthWeightGm: '',
    newbornLengthCm: '',
  })

  const resetEditForm = () => setEditForm({
    patientId: '',
    deliveryDate: '',
    deliveryTime: '',
    referral: false,
    referralInfo: '',
    amtsl: '',
    placenta: '',
    laceration: '',
    obstetricCxManaged: false,
    aphManaged: false,
    pphManaged: false,
    eclampsiaManaged: false,
    newbornSex: '',
    newbornTermStatus: '',
    newbornAlive: true,
    newbornApgarScore: '',
    newbornBirthWeightGm: '',
    newbornLengthCm: '',
  })

  const deliveryToEditForm = (r: Delivery): typeof form => {
    const raw = r as Record<string, unknown>
    const dd = r.deliveryDate
    const deliveryDate = typeof dd === 'string' && dd.length >= 10 ? dd.slice(0, 10) : ''
    const dt = raw.deliveryTime
    let deliveryTime = ''
    if (typeof dt === 'string') {
      if (dt.includes('T')) deliveryTime = dt.slice(11, 16)
      else if (/^\d{2}:\d{2}/.test(dt)) deliveryTime = dt.slice(0, 5)
    }
    const referral = Boolean(raw.referral)
    const referralInfo = typeof raw.referralInfo === 'string' ? raw.referralInfo : ''
    const amtslVal = r.amtsl
    const amtsl = (amtslVal === 'Ergometrine' || amtslVal === 'Oxytocin' || amtslVal === 'Misoprostol' ? amtslVal : '') as typeof form['amtsl']
    const placentaVal = r.placenta
    const placenta = (placentaVal === 'Completed' || placentaVal === 'Incomplete' || placentaVal === 'CCT' || placentaVal === 'MRP' || placentaVal === 'NRP' ? placentaVal : '') as typeof form['placenta']
    const lac = raw.laceration
    const laceration = (lac === '1st Degree' || lac === '2nd Degree' || lac === '3rd Degree' ? lac : '') as typeof form['laceration']

    return {
      patientId: r.patientId,
      deliveryDate,
      deliveryTime,
      referral,
      referralInfo,
      amtsl,
      placenta,
      laceration,
      obstetricCxManaged: Boolean(raw.obstetricCxManaged),
      aphManaged: Boolean(raw.aphManaged),
      pphManaged: Boolean(raw.pphManaged),
      eclampsiaManaged: Boolean(raw.eclampsiaManaged),
      newbornSex: '',
      newbornTermStatus: '',
      newbornAlive: true,
      newbornApgarScore: '',
      newbornBirthWeightGm: '',
      newbornLengthCm: '',
    }
  }

  const handleCreate = async () => {
    if (!form.patientId) return
    setSaving(true)
    try {
      const newborns = form.newbornSex
        ? [{
            sex: form.newbornSex as 'Male' | 'Female',
            termStatus: (form.newbornTermStatus || null) as 'Term' | 'Preterm' | null,
            alive: form.newbornAlive,
            apgarScore: form.newbornApgarScore ? parseInt(form.newbornApgarScore) : null,
            birthWeightGm: form.newbornBirthWeightGm ? parseFloat(form.newbornBirthWeightGm) : null,
            lengthCm: form.newbornLengthCm ? parseFloat(form.newbornLengthCm) : null,
            quantity: 'Single' as 'Single' | 'Multiple' | null,
            sb: null,
            vitK: undefined,
            ttc: undefined,
            babyMotherBonding: undefined,
          }]
        : undefined
      await deliveryService.create({
        patientId: form.patientId,
        deliveryDate: form.deliveryDate || undefined,
        deliveryTime: form.deliveryTime || undefined,
        referral: form.referral,
        referralInfo: form.referralInfo || undefined,
        amtsl: form.amtsl || undefined,
        placenta: form.placenta || undefined,
        laceration: form.laceration || undefined,
        obstetricCxManaged: form.obstetricCxManaged,
        aphManaged: form.aphManaged,
        pphManaged: form.pphManaged,
        eclampsiaManaged: form.eclampsiaManaged,
        newborns,
      })
      setShowCreateModal(false)
      resetForm()
      loadData()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery record?')) return
    try {
      await deliveryService.delete(id)
      loadData()
    } catch {}
  }

  const handleUpdate = async () => {
    if (!editId) return
    setSaving(true)
    try {
      await deliveryService.update(editId, {
        deliveryDate: editForm.deliveryDate || undefined,
        deliveryTime: editForm.deliveryTime || undefined,
        referral: editForm.referral,
        referralInfo: editForm.referralInfo || undefined,
        amtsl: editForm.amtsl || undefined,
        placenta: editForm.placenta || undefined,
        laceration: editForm.laceration || undefined,
      })
      setShowEditModal(false)
      setEditId(null)
      resetEditForm()
      loadData()
    } catch {}
    setSaving(false)
  }

  const openEditFromRecord = (r: Delivery) => {
    setEditId(r.id)
    setEditForm(deliveryToEditForm(r))
    setShowDetailModal(false)
    setShowEditModal(true)
  }

  const filtered = records.filter(r =>
    getPatientName(r.patientId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout title="Delivery Records" subtitle="Delivery and newborn record management">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="w-full sm:w-80">
          <Input placeholder="Search by patient name..." icon={Search} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" /> New Delivery Record
        </Button>
      </div>

      {loading ? (
        <LoadingState message="Loading delivery records..." />
      ) : filtered.length === 0 ? (
        <EmptyState message="No delivery records found" />
      ) : (
        <div className="grid gap-4">
          {filtered.map(record => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">{getPatientName(record.patientId)}</h3>
                      <div className="flex gap-3 text-sm text-slate-500 mt-1">
                        {record.deliveryDate && <span>Delivered: {formatDate(record.deliveryDate)}</span>}
                        <span>{record.newborns?.length ?? 0} newborn{(record.newborns?.length ?? 0) !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.amtsl && <Badge variant="info" size="sm">{record.amtsl}</Badge>}
                    {record.placenta && <Badge variant="default" size="sm">{record.placenta}</Badge>}
                    <button onClick={() => { setSelectedRecord(record); setShowDetailModal(true) }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(record.id)
                        setEditForm(deliveryToEditForm(record))
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
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Delivery Record" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Patient</label>
            <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select a patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Delivery Date" type="date" value={form.deliveryDate} onChange={e => setForm({ ...form, deliveryDate: e.target.value })} />
            <Input label="Delivery Time" type="time" value={form.deliveryTime} onChange={e => setForm({ ...form, deliveryTime: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={form.referral} onChange={e => setForm({ ...form, referral: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">Referral</span>
          </label>
          {form.referral && (
            <Input label="Referral Info" value={form.referralInfo} onChange={e => setForm({ ...form, referralInfo: e.target.value })} placeholder="Referral details..." />
          )}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AMTSL</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.amtsl} onChange={e => setForm({ ...form, amtsl: e.target.value as typeof form.amtsl })}>
                <option value="">Select...</option>
                <option value="Ergometrine">Ergometrine</option>
                <option value="Oxytocin">Oxytocin</option>
                <option value="Misoprostol">Misoprostol</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Placenta</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.placenta} onChange={e => setForm({ ...form, placenta: e.target.value as typeof form.placenta })}>
                <option value="">Select...</option>
                <option value="Completed">Completed</option>
                <option value="Incomplete">Incomplete</option>
                <option value="CCT">CCT</option>
                <option value="MRP">MRP</option>
                <option value="NRP">NRP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Laceration</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.laceration} onChange={e => setForm({ ...form, laceration: e.target.value as typeof form.laceration })}>
                <option value="">Select...</option>
                <option value="1st Degree">1st Degree</option>
                <option value="2nd Degree">2nd Degree</option>
                <option value="3rd Degree">3rd Degree</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={form.obstetricCxManaged} onChange={e => setForm({ ...form, obstetricCxManaged: e.target.checked })} />
              <span className="text-sm text-slate-700 dark:text-slate-300">Obstetric Cx Managed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={form.aphManaged} onChange={e => setForm({ ...form, aphManaged: e.target.checked })} />
              <span className="text-sm text-slate-700 dark:text-slate-300">APH Managed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={form.pphManaged} onChange={e => setForm({ ...form, pphManaged: e.target.checked })} />
              <span className="text-sm text-slate-700 dark:text-slate-300">PPH Managed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={form.eclampsiaManaged} onChange={e => setForm({ ...form, eclampsiaManaged: e.target.checked })} />
              <span className="text-sm text-slate-700 dark:text-slate-300">Eclampsia Managed</span>
            </label>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Newborn Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sex</label>
                <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.newbornSex} onChange={e => setForm({ ...form, newbornSex: e.target.value as typeof form.newbornSex })}>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Term Status</label>
                <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={form.newbornTermStatus} onChange={e => setForm({ ...form, newbornTermStatus: e.target.value as typeof form.newbornTermStatus })}>
                  <option value="">Select...</option>
                  <option value="Term">Term</option>
                  <option value="Preterm">Preterm</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={form.newbornAlive} onChange={e => setForm({ ...form, newbornAlive: e.target.checked })} />
                <span className="text-sm text-slate-700 dark:text-slate-300">Alive</span>
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3">
              <Input label="Apgar Score (0-10)" type="number" value={form.newbornApgarScore} onChange={e => setForm({ ...form, newbornApgarScore: e.target.value })} />
              <Input label="Birth Weight (gm)" type="number" value={form.newbornBirthWeightGm} onChange={e => setForm({ ...form, newbornBirthWeightGm: e.target.value })} />
              <Input label="Length (cm)" type="number" value={form.newbornLengthCm} onChange={e => setForm({ ...form, newbornLengthCm: e.target.value })} />
            </div>
          </div>

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
        title="Edit Delivery Record"
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
            <Input label="Delivery Date" type="date" value={editForm.deliveryDate} onChange={e => setEditForm({ ...editForm, deliveryDate: e.target.value })} />
            <Input label="Delivery Time" type="time" value={editForm.deliveryTime} onChange={e => setEditForm({ ...editForm, deliveryTime: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-brand-600" checked={editForm.referral} onChange={e => setEditForm({ ...editForm, referral: e.target.checked })} />
            <span className="text-sm text-slate-700 dark:text-slate-300">Referral</span>
          </label>
          {editForm.referral && (
            <Input label="Referral Info" value={editForm.referralInfo} onChange={e => setEditForm({ ...editForm, referralInfo: e.target.value })} placeholder="Referral details..." />
          )}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">AMTSL</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={editForm.amtsl} onChange={e => setEditForm({ ...editForm, amtsl: e.target.value as typeof editForm.amtsl })}>
                <option value="">Select...</option>
                <option value="Ergometrine">Ergometrine</option>
                <option value="Oxytocin">Oxytocin</option>
                <option value="Misoprostol">Misoprostol</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Placenta</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={editForm.placenta} onChange={e => setEditForm({ ...editForm, placenta: e.target.value as typeof editForm.placenta })}>
                <option value="">Select...</option>
                <option value="Completed">Completed</option>
                <option value="Incomplete">Incomplete</option>
                <option value="CCT">CCT</option>
                <option value="MRP">MRP</option>
                <option value="NRP">NRP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Laceration</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm" value={editForm.laceration} onChange={e => setEditForm({ ...editForm, laceration: e.target.value as typeof editForm.laceration })}>
                <option value="">Select...</option>
                <option value="1st Degree">1st Degree</option>
                <option value="2nd Degree">2nd Degree</option>
                <option value="3rd Degree">3rd Degree</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button variant="primary" onClick={handleUpdate} isLoading={saving}>Save Changes</Button>
            <Button variant="ghost" onClick={() => { setShowEditModal(false); setEditId(null) }}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Delivery Record Details" size="lg">
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500">Patient</p><p className="font-medium">{getPatientName(selectedRecord.patientId)}</p></div>
              <div><p className="text-xs text-slate-500">Delivery Date</p><p className="font-medium">{selectedRecord.deliveryDate ? formatDate(selectedRecord.deliveryDate) : 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">AMTSL</p><p className="font-medium">{selectedRecord.amtsl ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Placenta</p><p className="font-medium">{selectedRecord.placenta ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Referral</p><p className="font-medium">{selectedRecord.referral ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-slate-500">Laceration</p><p className="font-medium">{(selectedRecord as Record<string, unknown>).laceration as string ?? 'N/A'}</p></div>
              <div><p className="text-xs text-slate-500">Obstetric Cx Managed</p><p className="font-medium">{(selectedRecord as Record<string, unknown>).obstetricCxManaged ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-slate-500">APH Managed</p><p className="font-medium">{(selectedRecord as Record<string, unknown>).aphManaged ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-slate-500">PPH Managed</p><p className="font-medium">{(selectedRecord as Record<string, unknown>).pphManaged ? 'Yes' : 'No'}</p></div>
              <div><p className="text-xs text-slate-500">Eclampsia Managed</p><p className="font-medium">{(selectedRecord as Record<string, unknown>).eclampsiaManaged ? 'Yes' : 'No'}</p></div>
            </div>
            {selectedRecord.newborns && selectedRecord.newborns.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Newborns</h4>
                {selectedRecord.newborns.map((nb, idx) => (
                  <div key={nb.id ?? idx} className="grid grid-cols-3 gap-4 mb-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div><p className="text-xs text-slate-500">Sex</p><p className="font-medium">{nb.sex ?? 'N/A'}</p></div>
                    <div><p className="text-xs text-slate-500">Term</p><p className="font-medium">{nb.termStatus ?? 'N/A'}</p></div>
                    <div><p className="text-xs text-slate-500">Alive</p><p className="font-medium">{nb.alive ? 'Yes' : 'No'}</p></div>
                    <div><p className="text-xs text-slate-500">Apgar</p><p className="font-medium">{nb.apgarScore ?? 'N/A'}</p></div>
                    <div><p className="text-xs text-slate-500">Weight (gm)</p><p className="font-medium">{nb.birthWeightGm ?? 'N/A'}</p></div>
                    <div><p className="text-xs text-slate-500">Length (cm)</p><p className="font-medium">{nb.lengthCm ?? 'N/A'}</p></div>
                  </div>
                ))}
              </div>
            )}
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
