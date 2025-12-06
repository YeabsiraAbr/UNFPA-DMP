'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { mockGBVReports, mockPatients } from '@/lib/mock-data'
import { formatDate, cn } from '@/lib/utils'
import {
  Search,
  Plus,
  Shield,
  Lock,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  ArrowRight,
  Eye,
  Phone,
  MapPin,
  Heart,
} from 'lucide-react'
import type { GBVReport } from '@/lib/types'

export default function GBVPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState<GBVReport | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)

  const getPatientName = (patientId: string) => {
    const patient = mockPatients.find((p) => p.id === patientId)
    return patient?.fullName || 'Confidential'
  }

  const filteredReports = mockGBVReports.filter((report) => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    return matchesStatus
  })

  const handleViewReport = (report: GBVReport) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const statusConfig = {
    open: { variant: 'danger' as const, icon: AlertTriangle, label: 'Open' },
    in_progress: { variant: 'warning' as const, icon: Clock, label: 'In Progress' },
    referred: { variant: 'info' as const, icon: ArrowRight, label: 'Referred' },
    closed: { variant: 'success' as const, icon: CheckCircle, label: 'Closed' },
  }

  const incidentTypeLabels = {
    physical: 'Physical Violence',
    sexual: 'Sexual Violence',
    emotional: 'Emotional Abuse',
    economic: 'Economic Abuse',
    other: 'Other',
  }

  return (
    <DashboardLayout
      title="GBV Reporting"
      subtitle="Secure gender-based violence case management"
    >
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <FileText className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockGBVReports.length}</p>
              <p className="text-sm text-slate-500">Total Cases</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockGBVReports.filter((r) => r.status === 'open').length}
              </p>
              <p className="text-sm text-slate-500">Open Cases</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockGBVReports.filter((r) => r.status === 'in_progress').length}
              </p>
              <p className="text-sm text-slate-500">In Progress</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {mockGBVReports.filter((r) => r.status === 'closed').length}
              </p>
              <p className="text-sm text-slate-500">Resolved</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3">
            <Select
              options={[
                { value: 'all', label: 'All Cases' },
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'referred', label: 'Referred' },
                { value: 'closed', label: 'Closed' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            New Case Intake
          </Button>
        </div>
      </Card>

      {/* Cases List */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-500" />
            GBV Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report, index) => {
              const config = statusConfig[report.status]
              const StatusIcon = config.icon

              return (
                <div
                  key={report.id}
                  onClick={() => handleViewReport(report)}
                  className={cn(
                    'p-4 rounded-xl border cursor-pointer transition-all duration-200',
                    'hover:shadow-md',
                    report.status === 'open'
                      ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
                      : report.status === 'in_progress'
                      ? 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10'
                      : 'border-slate-200 dark:border-slate-700',
                    'animate-slide-up'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        report.confidentialityLevel === 'restricted'
                          ? 'bg-red-100 dark:bg-red-900/30'
                          : report.confidentialityLevel === 'high'
                          ? 'bg-amber-100 dark:bg-amber-900/30'
                          : 'bg-slate-100 dark:bg-slate-800'
                      )}>
                        <Shield className={cn(
                          'w-5 h-5',
                          report.confidentialityLevel === 'restricted'
                            ? 'text-red-600'
                            : report.confidentialityLevel === 'high'
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            Case #{report.id.slice(-4).toUpperCase()}
                          </h4>
                          <Badge variant={config.variant} size="sm" dot>
                            {config.label}
                          </Badge>
                          {report.confidentialityLevel === 'restricted' && (
                            <Badge variant="danger" size="sm">
                              <Lock className="w-3 h-3 mr-1" />
                              Restricted
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                          {incidentTypeLabels[report.incidentType]} • Reported {formatDate(report.reportDate)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span>Reported by {report.reportedBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {report.followUpRequired && report.followUpDate && (
                        <div className="flex items-center gap-1 text-sm text-amber-600">
                          <Calendar className="w-4 h-4" />
                          <span>Follow-up: {formatDate(report.followUpDate)}</span>
                        </div>
                      )}
                      {report.referrals.length > 0 && (
                        <p className="text-xs text-slate-500 mt-1">
                          {report.referrals.length} referral(s) made
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Detail Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={`Case #${selectedReport?.id.slice(-4).toUpperCase()}`}
        size="lg"
      >
        {selectedReport && (
          <div className="space-y-6">
            {/* Security Banner */}
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-700 dark:text-amber-400">
                Confidential case data. Access is being logged.
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={statusConfig[selectedReport.status].variant}
                    size="md"
                    dot
                  >
                    {statusConfig[selectedReport.status].label}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Incident Type</p>
                <p className="font-semibold">{incidentTypeLabels[selectedReport.incidentType]}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Report Date</p>
                <p className="font-semibold">{formatDate(selectedReport.reportDate)}</p>
              </div>
            </div>

            {/* Incident Details */}
            <div>
              <h4 className="font-semibold mb-3">Incident Details</h4>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-slate-600 dark:text-slate-400">{selectedReport.description}</p>
                {selectedReport.incidentDate && (
                  <p className="text-sm text-slate-500 mt-2">
                    Incident date: {formatDate(selectedReport.incidentDate)}
                  </p>
                )}
                {selectedReport.perpetratorRelation && (
                  <p className="text-sm text-slate-500 mt-1">
                    Perpetrator relation: {selectedReport.perpetratorRelation}
                  </p>
                )}
              </div>
            </div>

            {/* Injuries */}
            {selectedReport.injuries && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Injuries Documented
                </h4>
                <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  {selectedReport.injuries}
                </p>
              </div>
            )}

            {/* Safety Plan */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-500" />
                Safety Plan
              </h4>
              <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
                {selectedReport.safetyPlan}
              </p>
            </div>

            {/* Referrals */}
            {selectedReport.referrals.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Referrals Made</h4>
                <div className="space-y-2">
                  {selectedReport.referrals.map((referral, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <ArrowRight className="w-4 h-4 text-brand-500" />
                      <span>{referral}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-up */}
            {selectedReport.followUpRequired && selectedReport.followUpDate && (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span className="font-medium">Follow-up scheduled:</span>
                  <span>{formatDate(selectedReport.followUpDate)}</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="primary">
                <FileText className="w-4 h-4" />
                Update Case
              </Button>
              <Button variant="outline">
                <Phone className="w-4 h-4" />
                Schedule Follow-up
              </Button>
              {selectedReport.status !== 'closed' && (
                <Button variant="ghost">
                  <CheckCircle className="w-4 h-4" />
                  Close Case
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}


