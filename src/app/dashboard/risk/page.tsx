'use client'

/**
 * API: GET /analytics/high-risk for the high-risk patient list.
 * The “risk rules” section uses static in-file data (riskRules) — not loaded from an API.
 */

import { useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Progress } from '@/components/ui/Progress'
import { Modal } from '@/components/ui/Modal'
import { LoadingState } from '@/components/ui/LoadingState'
import { analyticsService } from '@/services'
import type { HighRiskPatient } from '@/services/types'
import { formatDate, cn } from '@/lib/utils'
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Activity,
  RefreshCcw,
  Info,
  ChevronRight,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import type { Patient } from '@/lib/types'

function patientFromHighRisk(hp: HighRiskPatient): Patient {
  const p = hp.patient as Record<string, unknown>
  return {
    id: String(p.id ?? ''),
    fullName: String(p.fullName ?? 'Unknown'),
    age: Number(p.age ?? 0),
    dateOfBirth: String(p.dateOfBirth ?? ''),
    idNumber: String(p.idNumber ?? ''),
    phoneNumber: String(p.phoneNumber ?? ''),
    address: String(p.address ?? ''),
    village: String(p.village ?? ''),
    emergencyContact: String(p.emergencyContact ?? ''),
    emergencyPhone: String(p.emergencyPhone ?? ''),
    pregnancyStatus: String(p.pregnancyStatus ?? 'pregnant') as Patient['pregnancyStatus'],
    gravida: Number(p.gravida ?? 0),
    para: Number(p.para ?? 0),
    riskLevel: String(p.riskLevel ?? 'high') as Patient['riskLevel'],
    riskScore: Number(p.riskScore ?? 80),
    riskFactors: (hp.riskFactors ?? []) as string[],
    registeredAt: String(p.registeredAt ?? p.createdAt ?? ''),
    assignedMidwife: String(p.assignedMidwife ?? ''),
    syncStatus: String(p.syncStatus ?? 'synced') as Patient['syncStatus'],
    clinicId: String(p.clinicId ?? ''),
  }
}

const riskRulesDef = [
  { id: 'r1', nameKey: 'riskPage.advancedMaternalAge', descKey: 'riskPage.advancedMaternalAgeDesc', condition: 'age >= 35', weight: 15, version: '1.0.3' },
  { id: 'r2', nameKey: 'riskPage.grandMultipara', descKey: 'riskPage.grandMultiparaDesc', condition: 'gravida >= 5', weight: 20, version: '1.0.3' },
  { id: 'r3', nameKey: 'riskPage.teenagePregnancy', descKey: 'riskPage.teenagePregnancyDesc', condition: 'age < 18', weight: 25, version: '1.0.3' },
  { id: 'r4', nameKey: 'riskPage.hypertensionRisk', descKey: 'riskPage.hypertensionRiskDesc', condition: 'bp_systolic >= 140 OR bp_diastolic >= 90', weight: 30, version: '1.0.3' },
  { id: 'r5', nameKey: 'riskPage.previousCesarean', descKey: 'riskPage.previousCesareanDesc', condition: 'previous_cesarean = true', weight: 15, version: '1.0.3' },
  { id: 'r6', nameKey: 'riskPage.anemia', descKey: 'riskPage.anemiaDesc', condition: 'hemoglobin < 11', weight: 10, version: '1.0.3' },
]

export default function RiskAssessmentPage() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const [highRiskPatients, setHighRiskPatients] = useState<Patient[]>([])

  const { t } = useTranslation()

  const loadHighRisk = () => {
    setLoading(true)
    analyticsService
      .getHighRiskPatients()
      .then((res) => {
        if (res.success && res.patients?.length) {
          setHighRiskPatients(res.patients.map(patientFromHighRisk))
        } else {
          setHighRiskPatients([])
        }
      })
      .catch(() => setHighRiskPatients([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadHighRisk()
  }, [])

  const handleViewRisk = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowRiskModal(true)
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low':
        return { variant: 'success' as const, icon: CheckCircle }
      case 'medium':
        return { variant: 'warning' as const, icon: Clock }
      case 'high':
        return { variant: 'warning' as const, icon: AlertTriangle }
      case 'critical':
        return { variant: 'danger' as const, icon: AlertTriangle }
      default:
        return { variant: 'default' as const, icon: Info }
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        title={t("appCopy.shell.riskTitle")}
        subtitle={t("appCopy.shell.riskSubtitle")}
      >
        <LoadingState message={t("appCopy.loading.risk")} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={t("appCopy.shell.riskTitle")}
      subtitle={t("appCopy.shell.riskSubtitle")}
    >
      {/* Info Banner */}
      <Card className="mb-6 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-200 dark:bg-purple-800">
              <Brain className="w-5 h-5 text-purple-700 dark:text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-300">
                {t("riskPage.bannerTitle")}
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                {t("riskPage.bannerDescription")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <Activity className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highRiskPatients.length}</p>
              <p className="text-sm text-slate-500">{t("riskPage.assessed")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {highRiskPatients.filter((p) => p.riskLevel === 'low').length}
              </p>
              <p className="text-sm text-slate-500">{t("riskPage.lowRisk")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {highRiskPatients.filter((p) => p.riskLevel === 'high').length}
              </p>
              <p className="text-sm text-slate-500">{t("riskPage.highRisk")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 ring-2 ring-red-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {highRiskPatients.filter((p) => p.riskLevel === 'critical').length}
              </p>
              <p className="text-sm text-slate-500">{t("riskPage.critical")}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High Risk Patients */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                {t("appCopy.riskPage.flaggedPatients")}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => loadHighRisk()} disabled={loading}>
                <RefreshCcw className={cn('w-4 h-4', loading && 'animate-spin')} />
                {t("common.refresh")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {highRiskPatients.map((patient, index) => {
                  const riskBadge = getRiskBadge(patient.riskLevel)
                  const RiskIcon = riskBadge.icon

                  return (
                    <div
                      key={patient.id}
                      onClick={() => handleViewRisk(patient)}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all duration-200',
                        'hover:shadow-md',
                        patient.riskLevel === 'critical'
                          ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
                          : 'border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10',
                        'animate-slide-up'
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Avatar fallback={patient.fullName} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900 dark:text-white">
                                {patient.fullName}
                              </h4>
                              <Badge
                                variant={riskBadge.variant}
                                size="sm"
                                dot
                                pulse={patient.riskLevel === 'critical'}
                              >
                                {patient.riskLevel.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              {patient.idNumber} • G{patient.gravida}P{patient.para} • {patient.age}yo
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-400" />
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                              {patient.riskScore}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{t("riskPage.riskScore")}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Progress
                          value={patient.riskScore}
                          variant={patient.riskLevel === 'critical' ? 'danger' : 'warning'}
                          size="sm"
                        />
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {patient.riskFactors.slice(0, 3).map((factor) => (
                          <Badge key={factor} variant="outline" size="sm">
                            {factor}
                          </Badge>
                        ))}
                        {patient.riskFactors.length > 3 && (
                          <Badge variant="outline" size="sm">
                            +{patient.riskFactors.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Rules */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-500" />
                {t("appCopy.riskPage.activeRules")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskRulesDef.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{t(rule.nameKey)}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{t(rule.descKey)}</p>
                      </div>
                      <Badge variant="default" size="sm">+{rule.weight}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500">
                  {t("riskPage.ruleVersionFooter")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>{t("appCopy.riskPage.riskScoreLegend")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                  <span className="text-sm">{t("appCopy.riskPage.legendLow")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-sm">{t("appCopy.riskPage.legendMedium")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-orange-500" />
                  <span className="text-sm">{t("appCopy.riskPage.legendHigh")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm">{t("appCopy.riskPage.legendCritical")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Risk Detail Modal */}
      <Modal
        isOpen={showRiskModal}
        onClose={() => setShowRiskModal(false)}
        title={t("appCopy.modal.riskAssessmentDetails")}
        size="lg"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* Patient Info */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
              <Avatar fallback={selectedPatient.fullName} size="lg" />
              <div>
                <h3 className="font-semibold text-lg">{selectedPatient.fullName}</h3>
                <p className="text-sm text-slate-500">
                  {selectedPatient.idNumber} • {selectedPatient.age} years old
                </p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t("riskPage.calculatedRiskScore")}</h3>
                <Badge
                  variant={getRiskBadge(selectedPatient.riskLevel).variant}
                  size="md"
                  dot
                  pulse={selectedPatient.riskLevel === 'critical'}
                >
                  {selectedPatient.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                {selectedPatient.riskScore}
                <span className="text-lg font-normal text-slate-400">/100</span>
              </div>
              <Progress
                value={selectedPatient.riskScore}
                size="lg"
                variant={
                  selectedPatient.riskLevel === 'critical'
                    ? 'danger'
                    : selectedPatient.riskLevel === 'high'
                    ? 'warning'
                    : 'success'
                }
              />
            </div>

            {/* Triggered Rules */}
            <div>
              <h4 className="font-semibold mb-3">{t("riskPage.triggeredRiskFactors")}</h4>
              <div className="space-y-2">
                {selectedPatient.riskFactors.map((factor, index) => (
                  <div
                    key={factor}
                    className="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>{factor}</span>
                    </div>
                    <Badge variant="warning" size="sm">Active</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-700 dark:text-purple-400">
                  <strong>{t("riskPage.note")}</strong> {t("riskPage.disclaimer")}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="primary">
                <FileText className="w-4 h-4" />
                {t("riskPage.viewFullRecord")}
              </Button>
              <Button variant="outline">
                <XCircle className="w-4 h-4" />
                {t("riskPage.overrideFlag")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  )
}




