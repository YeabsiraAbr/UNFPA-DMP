'use client'

/**
 * API: None — there is no alerts/notifications endpoint wired here.
 * State starts empty; filters and actions only affect local state until a backend exists.
 */

import { useState } from 'react'
import { useTranslation } from '@/lib/i18n'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { formatRelativeTime, cn } from '@/lib/utils'
import { downloadJson } from '@/lib/download'
import {
  Bell,
  AlertTriangle,
  Calendar,
  MessageSquare,
  RefreshCcw,
  Settings,
  Check,
  CheckCheck,
  Trash2,
  ArrowRight,
  Shield,
  Download,
} from 'lucide-react'
import type { Alert } from '@/lib/types'

export default function AlertsPage() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [alerts, setAlerts] = useState<Alert[]>([])

  const { t } = useTranslation()

  const filteredAlerts = alerts.filter((alert) => {
    const matchesType = typeFilter === 'all' || alert.type === typeFilter
    const matchesPriority = priorityFilter === 'all' || alert.priority === priorityFilter
    return matchesType && matchesPriority
  })

  const unreadCount = alerts.filter((a) => !a.readAt).length
  const criticalCount = alerts.filter((a) => a.priority === 'critical' && !a.readAt).length

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((a) => 
      a.id === id ? { ...a, readAt: new Date().toISOString() } : a
    ))
  }

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, readAt: new Date().toISOString() })))
  }

  const typeConfig = {
    appointment: { icon: Calendar, color: 'text-brand-500 bg-brand-50 dark:bg-brand-900/30' },
    risk: { icon: AlertTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-900/30' },
    teleconsult: { icon: MessageSquare, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30' },
    sync: { icon: RefreshCcw, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' },
    system: { icon: Settings, color: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
    gbv: { icon: Shield, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' },
  }

  const priorityConfig = {
    low: { variant: 'default' as const, label: t("alertsPage.low") },
    medium: { variant: 'info' as const, label: t("alertsPage.medium") },
    high: { variant: 'warning' as const, label: t("alertsPage.high") },
    critical: { variant: 'danger' as const, label: t("alertsPage.critical") },
  }

  return (
    <DashboardLayout
      title={t("appCopy.shell.alertsTitle")}
      subtitle={t("appCopy.shell.alertsSubtitle")}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <Bell className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{alerts.length}</p>
              <p className="text-sm text-slate-500">{t("alertsPage.totalAlerts")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-sm text-slate-500">{t("alertsPage.unread")}</p>
            </div>
          </div>
        </Card>
        <Card className={cn(
          "p-4",
          criticalCount > 0 && "ring-2 ring-red-500/50 animate-pulse"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{criticalCount}</p>
              <p className="text-sm text-slate-500">{t("alertsPage.critical")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {alerts.filter((a) => a.acknowledgedAt).length}
              </p>
              <p className="text-sm text-slate-500">{t("alertsPage.acknowledged")}</p>
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
                { value: 'all', label: t("alertsPage.allTypes") },
                { value: 'risk', label: t("alertsPage.riskAlerts") },
                { value: 'appointment', label: t("alertsPage.appointments") },
                { value: 'teleconsult', label: t("alertsPage.teleconsults") },
                { value: 'gbv', label: t("alertsPage.gbv") },
                { value: 'sync', label: t("alertsPage.sync") },
                { value: 'system', label: t("alertsPage.system") },
              ]}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
            <Select
              options={[
                { value: 'all', label: t("alertsPage.allPriorities") },
                { value: 'critical', label: t("alertsPage.critical") },
                { value: 'high', label: t("alertsPage.high") },
                { value: 'medium', label: t("alertsPage.medium") },
                { value: 'low', label: t("alertsPage.low") },
              ]}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => {
                setTypeFilter('all')
                setPriorityFilter('all')
              }}
            >
              <RefreshCcw className="w-4 h-4" />
              {t("common.refresh")}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                downloadJson(`alerts-export-${new Date().toISOString().slice(0, 10)}.json`, {
                  exportedAt: new Date().toISOString(),
                  alerts: filteredAlerts,
                })
              }
              disabled={!filteredAlerts.length}
            >
              <Download className="w-4 h-4" />
              {t("common.export")}
            </Button>
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4" />
              {t("alertsPage.markAllRead")}
            </Button>
            <Button variant="ghost" onClick={() => setAlerts([])}>
              <Trash2 className="w-4 h-4" />
              {t("alertsPage.clearAll")}
            </Button>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-500" />
            {t("appCopy.alertsPage.notificationsCard")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAlerts.map((alert, index) => {
              const config = typeConfig[alert.type]
              const priority = priorityConfig[alert.priority]
              const Icon = config.icon

              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                    'hover:shadow-md',
                    !alert.readAt && 'bg-brand-50/50 dark:bg-brand-900/10 border-brand-200 dark:border-brand-800',
                    alert.readAt && 'border-slate-200 dark:border-slate-700',
                    alert.priority === 'critical' && !alert.readAt && 'ring-2 ring-red-500/30',
                    'animate-slide-up'
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn('p-2 rounded-lg', config.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={cn(
                              'font-semibold',
                              !alert.readAt ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                            )}>
                              {alert.title}
                            </h4>
                            <Badge variant={priority.variant} size="sm">
                              {priority.label}
                            </Badge>
                            {!alert.readAt && (
                              <span className="w-2 h-2 rounded-full bg-brand-500" />
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {alert.message}
                          </p>
                          {alert.patientName && (
                            <p className="text-sm text-brand-600 dark:text-brand-400 mt-2">
                              {t("common.patient")}: {alert.patientName}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatRelativeTime(alert.createdAt)}
                        </span>
                      </div>
                      {alert.actionRequired && alert.actionUrl && (
                        <div className="mt-3">
                          <a
                            href={alert.actionUrl}
                            className="inline-flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t("alertsPage.takeAction")}
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{t("appCopy.empty.alerts")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}




