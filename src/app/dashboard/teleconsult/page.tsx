'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { mockTeleconsults, mockPatients } from '@/lib/mock-data'
import { formatDate, formatRelativeTime, cn } from '@/lib/utils'
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Paperclip,
  Send,
  Image,
  FileText,
  Stethoscope,
  ArrowRight,
  Eye,
} from 'lucide-react'
import type { TeleconsultRequest } from '@/lib/types'

export default function TeleconsultPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedConsult, setSelectedConsult] = useState<TeleconsultRequest | null>(null)
  const [showConsultModal, setShowConsultModal] = useState(false)

  const filteredConsults = mockTeleconsults.filter((consult) => {
    const matchesStatus = statusFilter === 'all' || consult.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || consult.priority === priorityFilter
    return matchesStatus && matchesPriority
  })

  const handleViewConsult = (consult: TeleconsultRequest) => {
    setSelectedConsult(consult)
    setShowConsultModal(true)
  }

  const statusConfig = {
    pending: { variant: 'warning' as const, icon: Clock, label: 'Pending' },
    assigned: { variant: 'info' as const, icon: User, label: 'Assigned' },
    in_review: { variant: 'info' as const, icon: Eye, label: 'In Review' },
    responded: { variant: 'success' as const, icon: CheckCircle, label: 'Responded' },
    closed: { variant: 'default' as const, icon: CheckCircle, label: 'Closed' },
  }

  const priorityConfig = {
    routine: { variant: 'default' as const, label: 'Routine' },
    urgent: { variant: 'warning' as const, label: 'Urgent' },
    emergency: { variant: 'danger' as const, label: 'Emergency' },
  }

  return (
    <DashboardLayout
      title="Teleconsult"
      subtitle="Asynchronous specialist consultations"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">{mockTeleconsults.length}</p>
              <p className="text-sm opacity-80">Total Requests</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {mockTeleconsults.filter((t) => t.status === 'pending' || t.status === 'in_review').length}
              </p>
              <p className="text-sm opacity-80">Awaiting Response</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {mockTeleconsults.filter((t) => t.priority === 'emergency').length}
              </p>
              <p className="text-sm opacity-80">Emergency</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-3xl font-bold">
                {mockTeleconsults.filter((t) => t.status === 'responded' || t.status === 'closed').length}
              </p>
              <p className="text-sm opacity-80">Resolved</p>
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
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_review', label: 'In Review' },
                { value: 'responded', label: 'Responded' },
                { value: 'closed', label: 'Closed' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
            <Select
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: 'routine', label: 'Routine' },
                { value: 'urgent', label: 'Urgent' },
                { value: 'emergency', label: 'Emergency' },
              ]}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            New Teleconsult
          </Button>
        </div>
      </Card>

      {/* Consultations List */}
      <div className="space-y-4">
        {filteredConsults.map((consult, index) => {
          const status = statusConfig[consult.status]
          const priority = priorityConfig[consult.priority]
          const StatusIcon = status.icon

          return (
            <Card
              key={consult.id}
              variant="elevated"
              hover
              className={cn(
                'animate-slide-up',
                consult.priority === 'emergency' && 'ring-2 ring-red-500/50'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => handleViewConsult(consult)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar fallback={consult.patientName} size="lg" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {consult.patientName}
                        </h3>
                        <Badge variant={priority.variant} size="sm">
                          {priority.label}
                        </Badge>
                        <Badge variant={status.variant} size="sm" dot>
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{consult.consultationType.replace('_', ' ')}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 line-clamp-2">
                        {consult.chiefComplaint}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{consult.requestedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(consult.requestDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          <span>{consult.attachments.length} attachments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {consult.assignedSpecialist && (
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-brand-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {consult.assignedSpecialist}
                        </span>
                      </div>
                    )}
                    {consult.response && (
                      <p className="text-xs text-emerald-600 mt-1">
                        Responded {formatRelativeTime(consult.response.respondedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Consult Detail Modal */}
      <Modal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
        title="Teleconsult Details"
        size="xl"
      >
        {selectedConsult && (
          <Tabs defaultValue="request">
            <TabsList className="mb-6">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="attachments">
                Attachments ({selectedConsult.attachments.length})
              </TabsTrigger>
              {selectedConsult.response && <TabsTrigger value="response">Response</TabsTrigger>}
            </TabsList>

            <TabsContent value="request">
              <div className="space-y-6">
                {/* Patient & Status */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <Avatar fallback={selectedConsult.patientName} size="lg" />
                    <div>
                      <h3 className="font-semibold text-lg">{selectedConsult.patientName}</h3>
                      <p className="text-sm text-slate-500">
                        {selectedConsult.consultationType.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={priorityConfig[selectedConsult.priority].variant} size="md">
                      {priorityConfig[selectedConsult.priority].label}
                    </Badge>
                    <Badge variant={statusConfig[selectedConsult.status].variant} size="md" dot>
                      {statusConfig[selectedConsult.status].label}
                    </Badge>
                  </div>
                </div>

                {/* Request Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-500">Requested By</p>
                    <p className="font-semibold">{selectedConsult.requestedBy}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-xs text-slate-500">Request Date</p>
                    <p className="font-semibold">{formatDate(selectedConsult.requestDate)}</p>
                  </div>
                  {selectedConsult.assignedSpecialist && (
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <p className="text-xs text-slate-500">Assigned To</p>
                      <p className="font-semibold">{selectedConsult.assignedSpecialist}</p>
                    </div>
                  )}
                </div>

                {/* Chief Complaint */}
                <div>
                  <h4 className="font-semibold mb-3">Chief Complaint</h4>
                  <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    {selectedConsult.chiefComplaint}
                  </p>
                </div>

                {/* Clinical Notes */}
                <div>
                  <h4 className="font-semibold mb-3">Clinical Notes</h4>
                  <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 whitespace-pre-wrap">
                    {selectedConsult.clinicalNotes}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attachments">
              <div className="space-y-3">
                {selectedConsult.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="flex items-center gap-3">
                      {attachment.type === 'ultrasound' ? (
                        <Image className="w-5 h-5 text-purple-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-brand-500" />
                      )}
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-xs text-slate-500 capitalize">
                          {attachment.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {selectedConsult.response && (
              <TabsContent value="response">
                <div className="space-y-6">
                  {/* Response Info */}
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold">Response from {selectedConsult.response.respondedBy}</span>
                    </div>
                    <p className="text-sm text-slate-500">
                      {formatDate(selectedConsult.response.respondedAt)}
                    </p>
                  </div>

                  {/* Diagnosis */}
                  {selectedConsult.response.diagnosis && (
                    <div>
                      <h4 className="font-semibold mb-3">Diagnosis</h4>
                      <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                        {selectedConsult.response.diagnosis}
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3">Recommendations</h4>
                    <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      {selectedConsult.response.recommendations}
                    </p>
                  </div>

                  {/* Follow-up Instructions */}
                  <div>
                    <h4 className="font-semibold mb-3">Follow-up Instructions</h4>
                    <p className="text-slate-600 dark:text-slate-400 p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
                      {selectedConsult.response.followUpInstructions}
                    </p>
                  </div>

                  {/* Prescriptions */}
                  {selectedConsult.response.prescriptions && selectedConsult.response.prescriptions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Prescriptions</h4>
                      <div className="space-y-2">
                        {selectedConsult.response.prescriptions.map((prescription, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                          >
                            <ArrowRight className="w-4 h-4 text-brand-500" />
                            <span>{prescription}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              {!selectedConsult.response && (
                <Button variant="primary">
                  <Send className="w-4 h-4" />
                  Send Response
                </Button>
              )}
              <Button variant="outline">View Patient Record</Button>
              {selectedConsult.response && (
                <Button variant="ghost">
                  <CheckCircle className="w-4 h-4" />
                  Close Consultation
                </Button>
              )}
            </div>
          </Tabs>
        )}
      </Modal>
    </DashboardLayout>
  )
}



