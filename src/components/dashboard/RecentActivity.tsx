'use client'

import { cn, formatRelativeTime } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import {
  UserPlus,
  Activity,
  Image,
  Shield,
  MessageSquare,
  AlertTriangle,
  RefreshCcw,
} from 'lucide-react'

interface Activity {
  id: string
  type: 'patient_registered' | 'visit_recorded' | 'ultrasound_captured' | 'gbv_reported' | 'teleconsult_sent' | 'risk_flagged' | 'data_synced'
  description: string
  user: string
  patient?: string
  timestamp: string
  metadata?: Record<string, string>
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'risk_flagged',
    description: 'Critical risk alert generated',
    user: 'System',
    patient: 'Zahra Ahmed Nur',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    metadata: { riskLevel: 'critical' },
  },
  {
    id: '2',
    type: 'teleconsult_sent',
    description: 'Emergency teleconsult request submitted',
    user: 'Sara Mohammed',
    patient: 'Zahra Ahmed Nur',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'visit_recorded',
    description: 'Prenatal visit #8 completed',
    user: 'Fatima Ali',
    patient: 'Khadija Ibrahim Hassan',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    type: 'ultrasound_captured',
    description: 'Ultrasound scan captured (28w5d)',
    user: 'Fatima Ali',
    patient: 'Khadija Ibrahim Hassan',
    timestamp: new Date(Date.now() - 7800000).toISOString(),
  },
  {
    id: '5',
    type: 'data_synced',
    description: '23 records synchronized from Shilabo',
    user: 'System',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '6',
    type: 'patient_registered',
    description: 'New patient registered',
    user: 'Sara Mohammed',
    patient: 'Farhiya Hassan Ali',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '7',
    type: 'gbv_reported',
    description: 'GBV intake form completed',
    user: 'Sara Mohammed',
    patient: 'Patient ID: #****04',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
]

const activityIcons = {
  patient_registered: UserPlus,
  visit_recorded: Activity,
  ultrasound_captured: Image,
  gbv_reported: Shield,
  teleconsult_sent: MessageSquare,
  risk_flagged: AlertTriangle,
  data_synced: RefreshCcw,
}

const activityColors = {
  patient_registered: 'text-brand-500 bg-brand-50 dark:bg-brand-900/30',
  visit_recorded: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
  ultrasound_captured: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30',
  gbv_reported: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
  teleconsult_sent: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
  risk_flagged: 'text-red-500 bg-red-50 dark:bg-red-900/30',
  data_synced: 'text-slate-500 bg-slate-50 dark:bg-slate-800',
}

export function RecentActivity() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type]
            
            return (
              <div
                key={activity.id}
                className={cn(
                  'flex items-start gap-4 p-3 rounded-lg transition-colors',
                  'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                  'animate-slide-up',
                  index === 0 && 'stagger-1',
                  index === 1 && 'stagger-2',
                  index === 2 && 'stagger-3',
                  index === 3 && 'stagger-4',
                  index === 4 && 'stagger-5'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={cn('p-2 rounded-lg', activityColors[activity.type])}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      by {activity.user}
                    </span>
                    {activity.patient && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {activity.patient}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {formatRelativeTime(activity.timestamp)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <a
            href="/dashboard/activity"
            className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            View all activity →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}



