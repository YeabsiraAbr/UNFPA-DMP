'use client'

/**
 * API: Partial — KPI row uses GET /analytics/dashboard only.
 * Chart tabs (Overview, Patients, Clinical, Operations) have no API; they show placeholders.
 * Date/clinic filters and Export are UI-only until endpoints exist.
 */

import { useTranslation } from '@/lib/i18n'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import type { ClinicStats } from '@/lib/types'
import { analyticsService } from '@/services'
import { downloadJson } from '@/lib/download'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
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
  const [refreshing, setRefreshing] = useState(false)

  const { t } = useTranslation()

  const loadDashboard = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await analyticsService.getDashboard()
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
    } catch {
      /* keep previous stats */
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  return (
    <DashboardLayout
      title={t("appCopy.shell.analyticsTitle")}
      subtitle={t("appCopy.shell.analyticsSubtitle")}
    >
      {/* Controls */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3">
            <Select
              options={[
                { value: 'all', label: t("analyticsPage.allClinics") },
              ]}
              value="all"
            />
            <Select
              options={[
                { value: '30', label: t("analyticsPage.last30Days") },
                { value: '90', label: t("analyticsPage.last90Days") },
                { value: '180', label: t("analyticsPage.last6Months") },
                { value: '365', label: t("analyticsPage.lastYear") },
              ]}
              value="180"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => loadDashboard()} disabled={refreshing}>
              <RefreshCcw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
              {t("common.refresh")}
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                downloadJson(`analytics-export-${new Date().toISOString().slice(0, 10)}.json`, {
                  exportedAt: new Date().toISOString(),
                  kpi: stats,
                })
              }
            >
              <Download className="w-4 h-4" />
              {t("analyticsPage.exportReport")}
            </Button>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card className="p-4 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
          <Users className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.totalPatients.toLocaleString()}</p>
          <p className="text-sm opacity-80">{t("analyticsPage.totalPatients")}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <Baby className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.activePregnancies}</p>
          <p className="text-sm opacity-80">{t("analyticsPage.activePregnancies")}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <Calendar className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.visitsThisMonth}</p>
          <p className="text-sm opacity-80">{t("analyticsPage.visitsMonth")}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <AlertTriangle className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.highRiskPatients}</p>
          <p className="text-sm opacity-80">{t("analyticsPage.highRisk")}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <MessageSquare className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.teleconsultsThisMonth}</p>
          <p className="text-sm opacity-80">{t("analyticsPage.teleconsults")}</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <Shield className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{stats.gbvReportsThisMonth}</p>
          <p className="text-sm opacity-80">{t("analyticsPage.gbvReports")}</p>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t("analyticsPage.tabOverview")}</TabsTrigger>
          <TabsTrigger value="patients">{t("analyticsPage.tabPatientAnalytics")}</TabsTrigger>
          <TabsTrigger value="clinical">{t("analyticsPage.tabClinicalMetrics")}</TabsTrigger>
          <TabsTrigger value="operations">{t("analyticsPage.tabOperations")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>{t("analyticsPage.placeholderNoOverview")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>{t("analyticsPage.placeholderNoPatientAnalytics")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinical">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>{t("analyticsPage.placeholderNoClinicalMetrics")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations">
          <Card variant="elevated">
            <CardContent className="py-12 text-center text-slate-500">
              <p>{t("analyticsPage.placeholderNoOperations")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}




