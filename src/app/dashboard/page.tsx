'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments'
import { HighRiskPatients } from '@/components/dashboard/HighRiskPatients'
import { LoadingState } from '@/components/ui/LoadingState'
import { analyticsService, cached } from '@/services'
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
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cached('dashboard-stats', () => analyticsService.getDashboard())
      .then(res => {
        if (res.success && res.data) setStats(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Digital Maternity Package - Nogob Zone, Ethiopia">
        <LoadingState message="Loading dashboard..." />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Digital Maternity Package - Nogob Zone, Ethiopia"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Patients"
          value={stats?.totalPatients?.toLocaleString() ?? '0'}
          subtitle="Registered mothers"
          icon={Users}
          color="brand"
        />
        <StatsCard
          title="Active Pregnancies"
          value={stats?.activePregnancies ?? 0}
          subtitle="Currently being monitored"
          icon={Baby}
          color="purple"
        />
        <StatsCard
          title="High Risk"
          value={stats?.highRiskCount ?? 0}
          subtitle="Patients requiring attention"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Today's Appointments"
          value={stats?.appointmentsToday ?? 0}
          subtitle="Scheduled visits"
          icon={Calendar}
          color="emerald"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Visits"
          value={stats?.totalVisits ?? 0}
          subtitle="All recorded visits"
          icon={Activity}
          color="brand"
        />
        <StatsCard
          title="Total Deliveries"
          value={stats?.totalDeliveries ?? 0}
          subtitle="Delivery records"
          icon={Stethoscope}
          color="purple"
        />
        <StatsCard
          title="GBV Cases"
          value={stats?.totalGBVCases ?? 0}
          subtitle="Total reported"
          icon={Shield}
          color="amber"
        />
        <StatsCard
          title="PNC Visits"
          value={stats?.totalPNCVisits ?? 0}
          subtitle="Postnatal care"
          icon={ClipboardList}
          color="emerald"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Visits This Month"
          value={stats?.visitsThisMonth ?? 0}
          icon={Activity}
          color="brand"
        />
        <StatsCard
          title="Patients This Month"
          value={stats?.patientsThisMonth ?? 0}
          subtitle="New registrations"
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Upcoming Appointments"
          value={stats?.upcomingAppointments ?? 0}
          subtitle="Next 7 days"
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
