'use client'

import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { Progress } from '../ui/Progress'
import { AlertTriangle, ArrowRight, Activity } from 'lucide-react'
import { mockPatients } from '@/lib/mock-data'

const highRiskPatients = mockPatients.filter(p => p.riskLevel === 'high' || p.riskLevel === 'critical')

export function HighRiskPatients() {
  return (
    <Card variant="elevated">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <CardTitle>High Risk Patients</CardTitle>
        </div>
        <Badge variant="danger">{highRiskPatients.length} patients</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {highRiskPatients.map((patient, index) => (
            <div
              key={patient.id}
              className={cn(
                'p-4 rounded-lg border cursor-pointer transition-all duration-200',
                'hover:shadow-md',
                patient.riskLevel === 'critical'
                  ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
                  : 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10',
                'animate-slide-up'
              )}
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar fallback={patient.fullName} size="md" />
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {patient.fullName}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {patient.idNumber}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={patient.riskLevel === 'critical' ? 'danger' : 'warning'}
                        size="sm"
                        dot
                        pulse={patient.riskLevel === 'critical'}
                      >
                        {patient.riskLevel.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        G{patient.gravida}P{patient.para} • {patient.age}yo
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" />
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {patient.riskScore}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Risk Score</p>
                </div>
              </div>
              
              {/* Risk Progress */}
              <div className="mt-3">
                <Progress
                  value={patient.riskScore}
                  max={100}
                  variant={patient.riskLevel === 'critical' ? 'danger' : 'warning'}
                  size="sm"
                />
              </div>
              
              {/* Risk Factors */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {patient.riskFactors.slice(0, 3).map((factor) => (
                  <span
                    key={factor}
                    className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    {factor}
                  </span>
                ))}
                {patient.riskFactors.length > 3 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    +{patient.riskFactors.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <a
            href="/dashboard/patients?risk=high"
            className="inline-flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            View all high-risk patients
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}



