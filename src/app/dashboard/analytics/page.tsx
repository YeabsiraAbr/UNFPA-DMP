'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import {
  VisitsChart,
  RiskDistributionChart,
  RiskFactorsChart,
  GestationalAgeChart,
  TeleconsultMetrics,
} from '@/components/dashboard/Charts'
import { mockAnalyticsData, mockClinicStats, mockClinics } from '@/lib/mock-data'
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  Baby,
  AlertTriangle,
  MessageSquare,
  Shield,
  RefreshCcw,
} from 'lucide-react'

export default function AnalyticsPage() {
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
                ...mockClinics.map((c) => ({ value: c.id, label: c.name })),
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
          <p className="text-3xl font-bold mt-2">{mockClinicStats.totalPatients.toLocaleString()}</p>
          <p className="text-sm opacity-80">Total Patients</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <Baby className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{mockClinicStats.activePregnancies}</p>
          <p className="text-sm opacity-80">Active Pregnancies</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <Calendar className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{mockClinicStats.visitsThisMonth}</p>
          <p className="text-sm opacity-80">Visits (Month)</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-red-500 to-red-600 text-white">
          <AlertTriangle className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{mockClinicStats.highRiskPatients}</p>
          <p className="text-sm opacity-80">High Risk</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <MessageSquare className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{mockClinicStats.teleconsultsThisMonth}</p>
          <p className="text-sm opacity-80">Teleconsults</p>
        </Card>
        <Card className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <Shield className="w-6 h-6 opacity-80" />
          <p className="text-3xl font-bold mt-2">{mockClinicStats.gbvReportsThisMonth}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <VisitsChart data={mockAnalyticsData.visitsByMonth} />
            </div>
            <div>
              <RiskDistributionChart data={mockAnalyticsData.riskDistribution} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskFactorsChart data={mockAnalyticsData.topRiskFactors} />
            <GestationalAgeChart data={mockAnalyticsData.gestationalAgeDistribution} />
          </div>
        </TabsContent>

        <TabsContent value="patients">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>Age 15-19</span>
                    <Badge variant="default">12%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>Age 20-24</span>
                    <Badge variant="default">28%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>Age 25-29</span>
                    <Badge variant="default">32%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>Age 30-34</span>
                    <Badge variant="default">18%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>Age 35+</span>
                    <Badge variant="warning">10%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Gravidity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>Primigravida (G1)</span>
                    <Badge variant="info">24%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>G2-G3</span>
                    <Badge variant="success">38%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>G4-G5</span>
                    <Badge variant="default">26%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span>Grand multipara (G6+)</span>
                    <Badge variant="warning">12%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <GestationalAgeChart data={mockAnalyticsData.gestationalAgeDistribution} />
            <RiskDistributionChart data={mockAnalyticsData.riskDistribution} />
          </div>
        </TabsContent>

        <TabsContent value="clinical">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskFactorsChart data={mockAnalyticsData.topRiskFactors} />
            <TeleconsultMetrics data={mockAnalyticsData.teleconsultMetrics} />
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>ANC Visit Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500">1st Trimester (≥1 visit)</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                      <div className="h-full w-[92%] bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500">2nd Trimester (≥2 visits)</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                      <div className="h-full w-[78%] bg-brand-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500">3rd Trimester (≥4 visits total)</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                      <div className="h-full w-[65%] bg-amber-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-500">Complete ANC (8+ visits)</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                      <div className="h-full w-[42%] bg-purple-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Ultrasound Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-6xl font-bold text-brand-600">68%</p>
                  <p className="text-slate-500 mt-2">Patients with at least one ultrasound</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <p className="text-2xl font-bold">1,247</p>
                    <p className="text-xs text-slate-500">Total Scans</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                    <p className="text-2xl font-bold">2.1</p>
                    <p className="text-xs text-slate-500">Avg per Patient</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Clinic Performance */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Clinic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockClinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800"
                    >
                      <div>
                        <h4 className="font-semibold">{clinic.name}</h4>
                        <p className="text-sm text-slate-500">{clinic.location}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xl font-bold">{clinic.patientCount}</p>
                          <p className="text-xs text-slate-500">Patients</p>
                        </div>
                        <Badge variant={clinic.status === 'active' ? 'success' : 'default'}>
                          {clinic.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sync Health */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Data Sync Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="w-32 h-32 mx-auto rounded-full border-8 border-emerald-500 flex items-center justify-center">
                    <div>
                      <p className="text-3xl font-bold text-emerald-600">98%</p>
                      <p className="text-xs text-slate-500">Sync Rate</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm">Pending Uploads</span>
                    <Badge variant="warning">{mockClinicStats.syncPendingCount}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm">Conflicts</span>
                    <Badge variant="danger">1</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-sm">Last Sync</span>
                    <span className="text-sm text-slate-500">30 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}



