'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments'
import { HighRiskPatients } from '@/components/dashboard/HighRiskPatients'
import { LoadingState } from '@/components/ui/LoadingState'
import { analyticsService, cached, clearCache } from '@/services'
import type { DashboardStats } from '@/services/types'
import {
  Users,
  Baby,
  AlertTriangle,
  Calendar,
  Activity,
  Shield,
  Stethoscope,
  ClipboardList,
  RefreshCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export default function DashboardPage() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadStats = useCallback(() => {
    setLoading(true)
    clearCache('dashboard-stats')
    cached('dashboard-stats', () => analyticsService.getDashboard())
      .then(res => {
        if (res.success && res.data) setStats(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  if (loading) {
    return (
      <DashboardLayout title={t("appCopy.shell.dashboardTitle")} subtitle={t("appCopy.shell.dashboardSubtitle")}>
        <LoadingState message={t("appCopy.loading.dashboard")} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={t("appCopy.shell.dashboardTitle")}
      subtitle={t("appCopy.shell.dashboardSubtitle")}
    >
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="md" onClick={() => loadStats()} disabled={loading}>
          <RefreshCcw className={cn('w-4 h-4', loading && 'animate-spin')} />
          {t("common.refresh")}
        </Button>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title={t("appCopy.dashboardHome.statTotalPatients")}
          value={stats?.totalPatients?.toLocaleString() ?? '0'}
          subtitle={t("appCopy.dashboardHome.statTotalPatientsSub")}
          icon={Users}
          color="brand"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statActivePregnancies")}
          value={stats?.activePregnancies ?? 0}
          subtitle={t("appCopy.dashboardHome.statActivePregnanciesSub")}
          icon={Baby}
          color="purple"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statHighRisk")}
          value={stats?.highRiskCount ?? 0}
          subtitle={t("appCopy.dashboardHome.statHighRiskSub")}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statTodayAppointments")}
          value={stats?.appointmentsToday ?? 0}
          subtitle={t("appCopy.dashboardHome.statTodayAppointmentsSub")}
          icon={Calendar}
          color="emerald"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title={t("appCopy.dashboardHome.statTotalVisits")}
          value={stats?.totalVisits ?? 0}
          subtitle={t("appCopy.dashboardHome.statTotalVisitsSub")}
          icon={Activity}
          color="brand"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statTotalDeliveries")}
          value={stats?.totalDeliveries ?? 0}
          subtitle={t("appCopy.dashboardHome.statTotalDeliveriesSub")}
          icon={Stethoscope}
          color="purple"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statGbvCases")}
          value={stats?.totalGBVCases ?? 0}
          subtitle={t("appCopy.dashboardHome.statGbvCasesSub")}
          icon={Shield}
          color="amber"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statPncVisits")}
          value={stats?.totalPNCVisits ?? 0}
          subtitle={t("appCopy.dashboardHome.statPncVisitsSub")}
          icon={ClipboardList}
          color="emerald"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title={t("appCopy.dashboardHome.statVisitsThisMonth")}
          value={stats?.visitsThisMonth ?? 0}
          icon={Activity}
          color="brand"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statPatientsThisMonth")}
          value={stats?.patientsThisMonth ?? 0}
          subtitle={t("appCopy.dashboardHome.statPatientsThisMonthSub")}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title={t("appCopy.dashboardHome.statUpcomingAppointments")}
          value={stats?.upcomingAppointments ?? 0}
          subtitle={t("appCopy.dashboardHome.statUpcomingAppointmentsSub")}
          icon={Calendar}
          color="emerald"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Risk & Appointments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HighRiskPatients />
        <UpcomingAppointments />
      </div>

      {/* Activity */}
      <div className="grid grid-cols-1">
        <RecentActivity />
      </div>
    </DashboardLayout>
  )
}
