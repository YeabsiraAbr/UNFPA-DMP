'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { mockClinics } from '@/lib/mock-data'
import { formatRelativeTime, cn } from '@/lib/utils'
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Users,
  RefreshCcw,
  Settings,
  Truck,
  Home,
  CheckCircle,
  XCircle,
  Signal,
  Edit,
  Trash2,
} from 'lucide-react'
import type { Clinic } from '@/lib/types'

export default function ClinicsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [showClinicModal, setShowClinicModal] = useState(false)

  const filteredClinics = mockClinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinic.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic)
    setShowClinicModal(true)
  }

  return (
    <DashboardLayout
      title="Clinics"
      subtitle="Manage mobile health units and fixed facilities"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">{mockClinics.length}</p>
              <p className="text-sm opacity-80">Total Facilities</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <Truck className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {mockClinics.filter((c) => c.type === 'mobile').length}
              </p>
              <p className="text-sm opacity-80">Mobile Units</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <Home className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {mockClinics.filter((c) => c.type === 'fixed').length}
              </p>
              <p className="text-sm opacity-80">Fixed Facilities</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {mockClinics.reduce((sum, c) => sum + c.patientCount, 0)}
              </p>
              <p className="text-sm opacity-80">Total Patients</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-64">
            <Input
              placeholder="Search clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Add Clinic
          </Button>
        </div>
      </Card>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinics.map((clinic, index) => (
          <Card
            key={clinic.id}
            variant="elevated"
            hover
            className={cn('animate-scale-in cursor-pointer')}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleViewClinic(clinic)}
          >
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-3 rounded-xl',
                    clinic.type === 'mobile'
                      ? 'bg-emerald-50 dark:bg-emerald-900/30'
                      : 'bg-purple-50 dark:bg-purple-900/30'
                  )}>
                    {clinic.type === 'mobile' ? (
                      <Truck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {clinic.name}
                    </h3>
                    <Badge
                      variant={clinic.type === 'mobile' ? 'success' : 'info'}
                      size="sm"
                    >
                      {clinic.type}
                    </Badge>
                  </div>
                </div>
                <Badge
                  variant={clinic.status === 'active' ? 'success' : 'default'}
                  size="sm"
                  dot
                >
                  {clinic.status}
                </Badge>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{clinic.location}, {clinic.woreda}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {clinic.patientCount}
                  </p>
                  <p className="text-xs text-slate-500">Patients</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {clinic.staff.length}
                  </p>
                  <p className="text-xs text-slate-500">Staff</p>
                </div>
              </div>

              {/* Sync Status */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCcw className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">
                    {formatRelativeTime(clinic.lastSync)}
                  </span>
                </div>
                <Signal className="w-4 h-4 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Clinic Detail Modal */}
      <Modal
        isOpen={showClinicModal}
        onClose={() => setShowClinicModal(false)}
        title={selectedClinic?.name}
        size="lg"
      >
        {selectedClinic && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center gap-3">
                {selectedClinic.type === 'mobile' ? (
                  <Truck className="w-6 h-6 text-emerald-600" />
                ) : (
                  <Home className="w-6 h-6 text-purple-600" />
                )}
                <div>
                  <p className="font-semibold capitalize">{selectedClinic.type} Facility</p>
                  <p className="text-sm text-slate-500">{selectedClinic.location}</p>
                </div>
              </div>
              <Badge
                variant={selectedClinic.status === 'active' ? 'success' : 'default'}
                size="md"
                dot
              >
                {selectedClinic.status}
              </Badge>
            </div>

            {/* Location Details */}
            <div>
              <h4 className="font-semibold mb-3">Location Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Region</p>
                  <p className="font-medium">{selectedClinic.region}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Zone</p>
                  <p className="font-medium">{selectedClinic.zone}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Woreda</p>
                  <p className="font-medium">{selectedClinic.woreda}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="font-medium">{selectedClinic.location}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div>
              <h4 className="font-semibold mb-3">Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-center">
                  <p className="text-3xl font-bold text-brand-600">{selectedClinic.patientCount}</p>
                  <p className="text-sm text-slate-500">Total Patients</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                  <p className="text-3xl font-bold text-emerald-600">{selectedClinic.staff.length}</p>
                  <p className="text-sm text-slate-500">Staff Members</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-center">
                  <p className="text-3xl font-bold text-purple-600">42</p>
                  <p className="text-sm text-slate-500">Visits/Month</p>
                </div>
              </div>
            </div>

            {/* Sync Info */}
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">Last synchronized:</span>
                <span>{formatRelativeTime(selectedClinic.lastSync)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="primary">
                <Edit className="w-4 h-4" />
                Edit Clinic
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4" />
                Configure
              </Button>
              <Button variant="ghost" className="text-red-600">
                <Trash2 className="w-4 h-4" />
                Deactivate
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}


