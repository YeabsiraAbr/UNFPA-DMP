'use client'

import { useState, useEffect } from 'react'
import { cn, formatDate } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { Calendar, Clock, MapPin, Loader2, Inbox } from 'lucide-react'
import { analyticsService } from '@/services'

interface Appointment {
  id: string
  patientName: string
  patientId: string
  type: string
  visitNumber: number
  gestationalAge: string
  time: string
  clinic: string
  midwife: string
  priority: 'normal' | 'high' | 'urgent'
}

const priorityBadge = {
  normal: { variant: 'default' as const, label: 'Routine' },
  high: { variant: 'warning' as const, label: 'High Risk' },
  urgent: { variant: 'danger' as const, label: 'Urgent' },
}

export function UpcomingAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsService.getTodaysAppointments().then(res => {
      if (res.success && res.appointments?.length) {
        setAppointments((res.appointments as Record<string, unknown>[]).map((a, i) => ({
          id: String(a.id ?? i),
          patientName: String(a.patientName ?? a.fullName ?? 'Unknown'),
          patientId: String(a.patientId ?? ''),
          type: 'Appointment',
          visitNumber: 0,
          gestationalAge: '',
          time: String(a.visitDate ?? a.scheduledDate ?? new Date().toISOString()),
          clinic: String(a.clinicName ?? a.clinicId ?? ''),
          midwife: '',
          priority: 'normal' as const,
        })))
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Appointments</CardTitle>
        <Badge variant="info">{loading ? '…' : `${appointments.length} today`}</Badge>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading appointments…</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming appointments today.</p>
          </div>
        ) : (
        <div className="space-y-4">
          {appointments.map((apt, index) => (
            <div
              key={apt.id}
              className={cn(
                'p-4 rounded-lg border transition-all duration-200 cursor-pointer',
                'hover:shadow-md hover:border-brand-200 dark:hover:border-brand-800',
                apt.priority === 'urgent' && 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10',
                apt.priority === 'high' && 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10',
                apt.priority === 'normal' && 'border-slate-200 dark:border-slate-700',
                'animate-slide-up'
              )}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar fallback={apt.patientName} size="md" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {apt.patientName}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {apt.patientId}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={priorityBadge[apt.priority].variant} size="sm">
                        {priorityBadge[apt.priority].label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {apt.type}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(apt.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {apt.clinic && (
                    <div className="flex items-center justify-end gap-1 mt-0.5 text-xs text-slate-400">
                      <MapPin className="w-3 h-3" />
                      {apt.clinic}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
