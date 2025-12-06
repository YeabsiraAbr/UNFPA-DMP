'use client'

import { cn, formatDate, formatDateTime } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { Calendar, Clock, MapPin } from 'lucide-react'

const appointments = [
  {
    id: '1',
    patientName: 'Halima Abdi Omar',
    patientId: 'ETH-NOG-2024-001',
    type: 'Prenatal Checkup',
    visitNumber: 6,
    gestationalAge: '25w3d',
    time: new Date(Date.now() + 3600000).toISOString(),
    clinic: 'Gode Mobile Clinic',
    midwife: 'Fatima Ali',
    priority: 'normal' as const,
  },
  {
    id: '2',
    patientName: 'Zahra Ahmed Nur',
    patientId: 'ETH-NOG-2024-004',
    type: 'Follow-up (High Risk)',
    visitNumber: 3,
    gestationalAge: '21w1d',
    time: new Date(Date.now() + 7200000).toISOString(),
    clinic: 'Shilabo Mobile Unit',
    midwife: 'Sara Mohammed',
    priority: 'urgent' as const,
  },
  {
    id: '3',
    patientName: 'Khadija Ibrahim Hassan',
    patientId: 'ETH-NOG-2024-003',
    type: 'Prenatal Checkup',
    visitNumber: 9,
    gestationalAge: '29w5d',
    time: new Date(Date.now() + 14400000).toISOString(),
    clinic: 'Gode Mobile Clinic',
    midwife: 'Fatima Ali',
    priority: 'high' as const,
  },
  {
    id: '4',
    patientName: 'Amina Mohammed Yusuf',
    patientId: 'ETH-NOG-2024-002',
    type: 'Prenatal Checkup',
    visitNumber: 4,
    gestationalAge: '18w2d',
    time: new Date(Date.now() + 86400000).toISOString(),
    clinic: 'Kebri Dehar Health Center',
    midwife: 'Sara Mohammed',
    priority: 'normal' as const,
  },
]

const priorityBadge = {
  normal: { variant: 'default' as const, label: 'Routine' },
  high: { variant: 'warning' as const, label: 'High Risk' },
  urgent: { variant: 'danger' as const, label: 'Urgent' },
}

export function UpcomingAppointments() {
  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Appointments</CardTitle>
        <Badge variant="info">{appointments.length} today</Badge>
      </CardHeader>
      <CardContent>
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
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Visit #{apt.visitNumber} • {apt.gestationalAge}
                      </span>
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
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />
                    {apt.clinic}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <a
            href="/dashboard/appointments"
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            View full schedule →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}


