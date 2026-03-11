'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { VisitsChart, RiskDistributionChart, TeleconsultMetrics } from '@/components/dashboard/Charts'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments'
import { HighRiskPatients } from '@/components/dashboard/HighRiskPatients'
import { mockClinicStats, mockAnalyticsData } from '@/lib/mock-data'
import {
  Users,
  Baby,
  AlertTriangle,
  Calendar,
  MessageSquare,
  RefreshCcw,
  Shield,
  Activity,
} from 'lucide-react'

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Digital Maternity Package - Nogob Zone, Ethiopia"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Patients"
          value={mockClinicStats.totalPatients.toLocaleString()}
          subtitle="Registered mothers"
          icon={Users}
          trend={{ value: 4.5, isPositive: true }}
          color="brand"
        />
        <StatsCard
          title="Active Pregnancies"
          value={mockClinicStats.activePregnancies}
          subtitle="Currently being monitored"
          icon={Baby}
          trend={{ value: 2.8, isPositive: true }}
          color="purple"
        />
        <StatsCard
          title="High Risk"
          value={mockClinicStats.highRiskPatients}
          subtitle="Patients requiring attention"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Today's Appointments"
          value={mockClinicStats.appointmentsToday}
          subtitle="Scheduled visits"
          icon={Calendar}
          color="emerald"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Visits This Month"
          value={mockClinicStats.visitsThisMonth}
          icon={Activity}
          trend={{ value: 8.2, isPositive: true }}
          color="brand"
        />
        <StatsCard
          title="Teleconsults"
          value={mockClinicStats.teleconsultsThisMonth}
          icon={MessageSquare}
          color="purple"
        />
        <StatsCard
          title="GBV Reports"
          value={mockClinicStats.gbvReportsThisMonth}
          subtitle="This month"
          icon={Shield}
          color="amber"
        />
        <StatsCard
          title="Pending Sync"
          value={mockClinicStats.syncPendingCount}
          subtitle="Records to upload"
          icon={RefreshCcw}
          color="emerald"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <VisitsChart data={mockAnalyticsData.visitsByMonth} />
        </div>
        <div>
          <TeleconsultMetrics data={mockAnalyticsData.teleconsultMetrics} />
        </div>
      </div>

      {/* Risk & Appointments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HighRiskPatients />
        <UpcomingAppointments />
      </div>

      {/* Activity & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <RiskDistributionChart data={mockAnalyticsData.riskDistribution} />
        </div>
      </div>
    </DashboardLayout>
  )
}




