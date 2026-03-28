'use client'

import { useState, useEffect } from 'react'
import { cn, formatRelativeTime } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import {
  UserPlus,
  Activity,
  Image,
  Shield,
  MessageSquare,
  AlertTriangle,
  RefreshCcw,
  Loader2,
  Inbox,
} from 'lucide-react'
import { getCachedPatients, visitService } from '@/services'

interface ActivityRow {
  id: string
  type: 'patient_registered' | 'visit_recorded' | 'ultrasound_captured' | 'gbv_reported' | 'teleconsult_sent' | 'risk_flagged' | 'data_synced'
  description: string
  user: string
  patient?: string
  timestamp: string
}

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
  const [activities, setActivities] = useState<ActivityRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const patients = await getCachedPatients()
        if (cancelled) return
        const items: ActivityRow[] = []

        for (const p of patients.slice(0, 8)) {
          items.push({
            id: `reg-${p.id}`,
            type: 'patient_registered',
            description: `Patient registered: ${p.fullName}`,
            user: 'System',
            patient: p.fullName,
            timestamp: String((p as Record<string, unknown>).registeredAt ?? (p as Record<string, unknown>).createdAt ?? ''),
          })
        }

        items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        if (!cancelled) setActivities(items.slice(0, 7))
      } catch {}
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading recent activity…</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity to show.</p>
          </div>
        ) : (
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
                {activity.timestamp && (
                  <span className="text-xs text-slate-400 whitespace-nowrap">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
