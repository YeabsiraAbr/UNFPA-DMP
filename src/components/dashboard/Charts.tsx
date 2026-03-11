'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'

const COLORS = {
  brand: '#0891b2',
  purple: '#8b5cf6',
  emerald: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  slate: '#64748b',
}

interface VisitsChartProps {
  data: { month: string; visits: number; newPatients: number }[]
}

export function VisitsChart({ data }: VisitsChartProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Visits & New Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.brand} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.brand} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="visits"
                name="Total Visits"
                stroke={COLORS.brand}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVisits)"
              />
              <Area
                type="monotone"
                dataKey="newPatients"
                name="New Patients"
                stroke={COLORS.purple}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPatients)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface RiskDistributionProps {
  data: { level: string; count: number }[]
}

export function RiskDistributionChart({ data }: RiskDistributionProps) {
  const chartColors = [COLORS.emerald, COLORS.amber, COLORS.red, '#dc2626']
  
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Risk Level Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="count"
                nameKey="level"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface RiskFactorsProps {
  data: { factor: string; count: number }[]
}

export function RiskFactorsChart({ data }: RiskFactorsProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Top Risk Factors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 80, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="factor" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill={COLORS.brand} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface GestationalAgeProps {
  data: { range: string; count: number }[]
}

export function GestationalAgeChart({ data }: GestationalAgeProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Gestational Age Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="range" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface TeleconsultMetricsProps {
  data: {
    totalRequests: number
    avgResponseTime: number
    pendingCount: number
    resolvedCount: number
  }
}

export function TeleconsultMetrics({ data }: TeleconsultMetricsProps) {
  const chartData = [
    { name: 'Pending', value: data.pendingCount, color: COLORS.amber },
    { name: 'Resolved', value: data.resolvedCount, color: COLORS.emerald },
  ]

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Teleconsult Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Total Requests</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.totalRequests}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
            <p className="text-sm text-slate-500">Avg Response</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.avgResponseTime}h</p>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}




