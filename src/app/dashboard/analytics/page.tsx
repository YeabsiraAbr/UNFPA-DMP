'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import type { ClinicStats } from '@/lib/types'
import { analyticsService } from '@/services'
import { useState, useEffect } from 'react'
import {
  Download,
  Calendar,
  Users,
  Baby,
  AlertTriangle,
  MessageSquare,
  Shield,
  RefreshCcw,
} from 'lucide-react'

const DEFAULT_STATS: ClinicStats = {
  totalPatients: 0,
  activePregnancies: 0,
  highRiskPatients: 0,
  visitsThisMonth: 0,
  teleconsultsThisMonth: 0,
  gbvReportsThisMonth: 0,
  syncPendingCount: 0,
  appointmentsToday: 0,
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    analyticsService.getDashboard().then(res => {
      if (res.success && res.data) {
        setStats({
          totalPatients: res.data.totalPatients ?? DEFAULT_STATS.totalPatients,
          activePregnancies: res.data.activePregnancies ?? DEFAULT_STATS.activePregnancies,
          highRiskPatients: res.data.highRiskCount ?? DEFAULT_STATS.highRiskPatients,
          appointmentsToday: DEFAULT_STATS.appointmentsToday,
          visitsThisMonth: res.data.visitsThisMonth ?? DEFAULT_STATS.visitsThisMonth,
          teleconsultsThisMonth: DEFAULT_STATS.teleconsultsThisMonth,
          gbvReportsThisMonth: res.data.totalGBVCases ?? DEFAULT_STATS.gbvReportsThisMonth,
          syncPendingCount: DEFAULT_STATS.syncPendingCount,
        })
      }
    }).catch(() => {})
  }, [])

  return (
    <DashboardLayout
      title="Analytics"
      subtitle="Program insights and performance metrics"
    >
      {/* Controls */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3">
            <Select
              options={[
                { value: 'all', label: 'All Clinics' },
              ]}
              value="all"
            />
            <Select
              options={[
                { value: '30', label: 'Last 30 Days' },
                { value: '90', label: 'Last 90 Days' },
                { value: '180', label: 'Last 6 Months' },
                { value: '365', label: 'Last Year' },
              ]}
              value="180"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCcw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="primary">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
          <Users className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.totalPatients.toLocaleString()}</p>
          <p className="text-sm opacity-80">Total Patients</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <Baby className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.activePregnancies}</p>
          <p className="text-sm opacity-80">Active Pregnancies</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <Calendar className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.visitsThisMonth}</p>
          <p className="text-sm opacity-80">Visits (Month)</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <AlertTriangle className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.highRiskPatients}</p>
          <p className="text-sm opacity-80">High Risk</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <MessageSquare className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.teleconsultsThisMonth}</p>
          <p className="text-sm opacity-80">Teleconsults</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <Shield className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.gbvReportsThisMonth}</p>
          <p className="text-sm opacity-80">GBV Reports</p>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Metrics</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>No chart data available from the API yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>Patient demographic analytics are not available from the API yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinical">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>Clinical metrics analytics are not available from the API yet.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>Operations analytics are not available from the API yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}




