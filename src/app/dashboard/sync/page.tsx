'use client'

/**
 * API: Partial — only GET /profile/sync-status is used (last sync time when returned).
 * Queue, conflicts, online/offline banner, storage bars, and “Sync Now” are not backed by sync APIs (static defaults or empty lists).
 */

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/Progress'
import { profileService } from '@/services'
import { formatDateTime, formatRelativeTime, cn } from '@/lib/utils'
import {
  RefreshCcw,
  Wifi,
  WifiOff,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Cloud,
  Smartphone,
  HardDrive,
  ArrowUpDown,
  XCircle,
  Play,
  Pause,
} from 'lucide-react'

const DEFAULT_SYNC_STATUS = {
  isOnline: false,
  pendingUploads: 0,
  pendingDownloads: 0,
  conflicts: 0,
}

const clinicSyncList: Array<{
  id: string
  name: string
  status: string
  lastSync: string
  patientCount: number
}> = []

const syncQueue: Array<{
  id: string; type: string; action: string; patientName: string;
  status: string; progress?: number; timestamp: string;
}> = []

const syncConflicts: Array<{
  id: string; patientId: string; patientName: string; field: string;
  localValue: string; serverValue: string; localTimestamp: string; serverTimestamp: string;
}> = []

export default function SyncStatusPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncData, setSyncData] = useState<{ lastSyncTime?: string } | null>(null)

  useEffect(() => {
    profileService.getSyncStatus().then(res => {
      if (res.success && res.data) {
        setSyncData(res.data as { lastSyncTime?: string })
      }
    }).catch(() => {})
  }, [])

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 3000)
  }

  return (
    <DashboardLayout
      title="Sync Status"
      subtitle="Data synchronization and offline queue management"
    >
      {/* Connection Status Banner */}
      <Card className={cn(
        'mb-6',
        DEFAULT_SYNC_STATUS.isOnline
          ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800'
          : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'p-2 rounded-lg',
                DEFAULT_SYNC_STATUS.isOnline
                  ? 'bg-emerald-200 dark:bg-emerald-800'
                  : 'bg-red-200 dark:bg-red-800'
              )}>
                {DEFAULT_SYNC_STATUS.isOnline ? (
                  <Wifi className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-700 dark:text-red-300" />
                )}
              </div>
              <div>
                <h3 className={cn(
                  'font-semibold',
                  DEFAULT_SYNC_STATUS.isOnline
                    ? 'text-emerald-800 dark:text-emerald-300'
                    : 'text-red-800 dark:text-red-300'
                )}>
                  {DEFAULT_SYNC_STATUS.isOnline ? 'Online - Connected to Server' : 'Offline - No Connection'}
                </h3>
                <p className={cn(
                  'text-sm',
                  DEFAULT_SYNC_STATUS.isOnline
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-red-700 dark:text-red-400'
                )}>
                  Last sync: {syncData?.lastSyncTime ? formatRelativeTime(syncData.lastSyncTime) : '—'}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleSync}
              isLoading={isSyncing}
              disabled={!DEFAULT_SYNC_STATUS.isOnline}
            >
              <RefreshCcw className={cn('w-4 h-4', isSyncing && 'animate-spin')} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30">
              <Upload className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{DEFAULT_SYNC_STATUS.pendingUploads}</p>
              <p className="text-sm text-slate-500">Pending Uploads</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/30">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{DEFAULT_SYNC_STATUS.pendingDownloads}</p>
              <p className="text-sm text-slate-500">Pending Downloads</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{DEFAULT_SYNC_STATUS.conflicts}</p>
              <p className="text-sm text-slate-500">Conflicts</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">—</p>
              <p className="text-sm text-slate-500">Sync Rate</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sync Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-brand-500" />
                Sync Queue
              </CardTitle>
              <Badge variant="warning">{syncQueue.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {syncQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'p-2 rounded-lg',
                          item.type === 'patient' && 'bg-brand-50 dark:bg-brand-900/30',
                          item.type === 'visit' && 'bg-emerald-50 dark:bg-emerald-900/30',
                          item.type === 'ultrasound' && 'bg-purple-50 dark:bg-purple-900/30'
                        )}>
                          {item.type === 'patient' && <Database className="w-4 h-4 text-brand-600" />}
                          {item.type === 'visit' && <Clock className="w-4 h-4 text-emerald-600" />}
                          {item.type === 'ultrasound' && <HardDrive className="w-4 h-4 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{item.type} - {item.action}</p>
                          <p className="text-sm text-slate-500">{item.patientName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={item.status === 'uploading' ? 'info' : 'warning'}
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    {item.status === 'uploading' && item.progress && (
                      <div className="mt-3">
                        <Progress value={item.progress} size="sm" variant="gradient" />
                        <p className="text-xs text-slate-500 mt-1">{item.progress}% uploaded</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conflicts */}
          {syncConflicts.length > 0 && (
            <Card variant="elevated" className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Sync Conflicts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {syncConflicts.map((conflict) => (
                    <div
                      key={conflict.id}
                      className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{conflict.patientName}</h4>
                          <p className="text-sm text-slate-500">Conflict in: {conflict.field}</p>
                        </div>
                        <Badge variant="danger" size="sm">Requires Resolution</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="w-4 h-4 text-brand-500" />
                            <span className="text-xs font-medium text-slate-500">Local Value</span>
                          </div>
                          <p className="font-semibold">{conflict.localValue}</p>
                          <p className="text-xs text-slate-400">{formatDateTime(conflict.localTimestamp)}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-slate-800">
                          <div className="flex items-center gap-2 mb-2">
                            <Cloud className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-medium text-slate-500">Server Value</span>
                          </div>
                          <p className="font-semibold">{conflict.serverValue}</p>
                          <p className="text-xs text-slate-400">{formatDateTime(conflict.serverTimestamp)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="primary" size="sm">Keep Local</Button>
                        <Button variant="outline" size="sm">Keep Server</Button>
                        <Button variant="ghost" size="sm">Manual Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Clinic Sync Status */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Clinic Sync Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clinicSyncList.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{clinic.name}</h4>
                      <Badge
                        variant={clinic.status === 'active' ? 'success' : 'default'}
                        size="sm"
                      >
                        {clinic.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Last sync: {formatRelativeTime(clinic.lastSync)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {clinic.patientCount} patients
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Storage Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>Storage information is not available from the API yet.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}




