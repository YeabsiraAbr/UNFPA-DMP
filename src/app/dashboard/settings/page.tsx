'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { profileService, authService, rolesService } from '@/services'
import type { Role } from '@/services/types'
import {
  Settings,
  User,
  Shield,
  Bell,
  Database,
  Globe,
  Key,
  Save,
  Plus,
  Trash2,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Languages,
  RefreshCcw,
  HelpCircle,
  Mail,
  PhoneCall,
  ExternalLink,
} from 'lucide-react'

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(true)
  const [profile, setProfile] = useState({ name: '', phone: '', role: 'doctor' })
  const [isSaving, setIsSaving] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [roles, setRoles] = useState<Role[]>([])
  const [loadingRoles, setLoadingRoles] = useState(false)
  const [helpInfo, setHelpInfo] = useState<{ email?: string; phone?: string; faqUrl?: string } | null>(null)
  const [loadingHelp, setLoadingHelp] = useState(false)

  useEffect(() => {
    profileService.getMe().then(res => {
      if (res.success && res.profile) {
        setProfile({
          name: res.profile.fullName || '',
          phone: res.profile.phone || '',
          role: 'doctor',
        })
      }
    }).catch(() => {})

    setLoadingRoles(true)
    rolesService.getAll().then(res => {
      if (res.success && res.roles) setRoles(res.roles)
    }).catch(() => {}).finally(() => setLoadingRoles(false))

    setLoadingHelp(true)
    profileService.getHelp().then(res => {
      if (res.success && res.data) {
        const d = res.data as Record<string, unknown>
        setHelpInfo({
          email: (d.email as string) ?? undefined,
          phone: (d.phone as string) ?? undefined,
          faqUrl: (d.faqUrl as string) ?? undefined,
        })
      }
    }).catch(() => {}).finally(() => setLoadingHelp(false))
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      await profileService.updateMe({ fullName: profile.name })
    } catch {}
    setIsSaving(false)
  }

  const handleChangePassword = async () => {
    setPwMessage('')
    if (!currentPw || !newPw) { setPwMessage('Please fill all password fields'); return }
    if (newPw !== confirmPw) { setPwMessage('Passwords do not match'); return }
    if (newPw.length < 4) { setPwMessage('Password must be at least 4 characters'); return }
    try {
      await authService.changePassword({ currentPassword: currentPw, newPassword: newPw })
      setPwMessage('Password changed successfully!')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err) {
      setPwMessage(err instanceof Error ? err.message : 'Failed to change password')
    }
  }

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await rolesService.assign(userId, roleId)
    } catch {}
  }

  const handleRemoveRole = async (userId: string, roleId: string) => {
    if (!confirm('Remove this role from user?')) return
    try {
      await rolesService.remove(userId, roleId)
    } catch {}
  }

  return (
    <DashboardLayout
      title="Settings"
      subtitle="System configuration and user management"
    >
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-500" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-6">
                  <Avatar fallback={profile.name || 'User'} size="xl" status="online" />
                  <div>
                    <h3 className="text-xl font-semibold">{profile.name || 'User'}</h3>
                    <p className="text-slate-500 capitalize">{profile.role}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <Input label="Phone Number" value={profile.phone} disabled />
                  <Select
                    label="Role"
                    options={[
                      { value: 'admin', label: 'Administrator' },
                      { value: 'doctor', label: 'Doctor' },
                      { value: 'midwife', label: 'Midwife' },
                      { value: 'nurse', label: 'Nurse' },
                    ]}
                    value={profile.role}
                    disabled
                  />
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="primary" onClick={handleSaveProfile} isLoading={isSaving}>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <span>Dark Mode</span>
                    </div>
                    <button
                      onClick={() => setIsDark(!isDark)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        isDark ? 'bg-brand-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        isDark ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Languages className="w-5 h-5" />
                      <span>Language</span>
                    </div>
                    <Select
                      options={[
                        { value: 'EN', label: 'English' },
                        { value: 'SO', label: 'Soomaali' },
                      ]}
                      value="EN"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-5 h-5" />
                      <span>Timezone</span>
                    </div>
                    <Select
                      options={[
                        { value: 'eat', label: 'East Africa Time (UTC+3)' },
                        { value: 'utc', label: 'UTC' },
                      ]}
                      value="eat"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand-500" />
                User Management
              </CardTitle>
              <Button variant="primary">
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-500 text-center py-8">
                  No users listed. A user directory API is not available yet.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-brand-500" />
                Roles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRoles ? (
                <p className="text-sm text-slate-500">Loading roles…</p>
              ) : roles.length === 0 ? (
                <p className="text-sm text-slate-500">No roles found</p>
              ) : (
                <div className="space-y-3">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div>
                        <h4 className="font-medium capitalize">{role.name}</h4>
                        <p className="text-xs text-slate-500 font-mono">{role.id}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const userId = prompt('Enter user ID to assign this role:')
                            if (userId) handleAssignRole(userId, role.id)
                          }}
                        >
                          Assign
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => {
                            const userId = prompt('Enter user ID to remove this role from:')
                            if (userId) handleRemoveRole(userId, role.id)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-500" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Critical risk alerts', description: 'Immediate notification for critical patient risks', enabled: true },
                  { label: 'Teleconsult responses', description: 'When a specialist responds to your consultation', enabled: true },
                  { label: 'Appointment reminders', description: 'Upcoming patient appointment notifications', enabled: true },
                  { label: 'Sync status updates', description: 'Data synchronization success/failure alerts', enabled: false },
                  { label: 'GBV case updates', description: 'Updates on gender-based violence cases', enabled: true },
                  { label: 'System announcements', description: 'Platform updates and maintenance notices', enabled: false },
                ].map((notification, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <h4 className="font-medium">{notification.label}</h4>
                      <p className="text-sm text-slate-500">{notification.description}</p>
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notification.enabled ? 'bg-brand-600' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                        notification.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-brand-500" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pwMessage && (
                    <div className={`p-3 rounded-lg text-sm ${pwMessage.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                      {pwMessage}
                    </div>
                  )}
                  <Input label="Current Password" type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
                  <Input label="New Password" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
                  <Input label="Confirm New Password" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
                  <Button variant="primary" onClick={handleChangePassword}>
                    <Lock className="w-4 h-4" />
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Monitor className="w-5 h-5 text-emerald-600" />
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-xs text-slate-500">Chrome on macOS</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium">Mobile App</p>
                          <p className="text-xs text-slate-500">Android - Last active 2h ago</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-brand-500" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Version</span>
                    <Badge variant="info">v1.0.0</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Risk Rules Version</span>
                    <span className="font-medium">1.0.3</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Database</span>
                    <span className="font-medium">SQLCipher (Encrypted)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">API Endpoint</span>
                    <span className="font-mono text-sm">api.unfpa-dmp.org</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-slate-500">Encryption</span>
                    <span className="font-medium">AES-256 / TLS 1.3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCcw className="w-4 h-4" />
                    Force Sync All Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4" />
                    Clear Local Cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-amber-600">
                    <Settings className="w-4 h-4" />
                    Reset Risk Rules
                  </Button>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button variant="danger" className="w-full">
                      <Trash2 className="w-4 h-4" />
                      Clear All Local Data
                    </Button>
                    <p className="text-xs text-slate-500 text-center mt-2">
                      This will remove all locally stored data. Server data is not affected.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="lg:col-span-2 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-500" />
                  Help &amp; Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingHelp ? (
                  <p className="text-sm text-slate-500">Loading help information…</p>
                ) : helpInfo ? (
                  <div className="space-y-4">
                    {helpInfo.email && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <span className="text-sm text-slate-500">Email</span>
                          <p className="font-medium">
                            <a href={`mailto:${helpInfo.email}`} className="text-brand-500 hover:underline">
                              {helpInfo.email}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    {helpInfo.phone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <PhoneCall className="w-5 h-5 text-slate-400" />
                        <div>
                          <span className="text-sm text-slate-500">Phone</span>
                          <p className="font-medium">
                            <a href={`tel:${helpInfo.phone}`} className="text-brand-500 hover:underline">
                              {helpInfo.phone}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    {helpInfo.faqUrl && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <ExternalLink className="w-5 h-5 text-slate-400" />
                        <div>
                          <span className="text-sm text-slate-500">FAQ</span>
                          <p className="font-medium">
                            <a href={helpInfo.faqUrl} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline">
                              View FAQ
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                    {!helpInfo.email && !helpInfo.phone && !helpInfo.faqUrl && (
                      <p className="text-sm text-slate-500">No help information available</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Help information unavailable</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}




