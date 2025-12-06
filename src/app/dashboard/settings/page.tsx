'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { currentUser, mockUsers } from '@/lib/mock-data'
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
  Edit,
  Trash2,
  Lock,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Languages,
  RefreshCcw,
} from 'lucide-react'

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(true)

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
                  <Avatar fallback={currentUser.name} size="xl" status={currentUser.status} />
                  <div>
                    <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                    <p className="text-slate-500 capitalize">{currentUser.role}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Change Photo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={currentUser.name} />
                  <Input label="Email" defaultValue={currentUser.email} />
                  <Input label="Phone" defaultValue="+251912345678" />
                  <Select
                    label="Role"
                    options={[
                      { value: 'admin', label: 'Administrator' },
                      { value: 'doctor', label: 'Doctor' },
                      { value: 'midwife', label: 'Midwife' },
                      { value: 'nurse', label: 'Nurse' },
                    ]}
                    value={currentUser.role}
                  />
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="primary">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button variant="ghost">Cancel</Button>
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
                        { value: 'en', label: 'English' },
                        { value: 'am', label: 'Amharic' },
                        { value: 'so', label: 'Somali' },
                      ]}
                      value="en"
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
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar fallback={user.name} size="md" status={user.status} />
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="info" size="md" className="capitalize">
                        {user.role}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <Input label="Current Password" type="password" />
                  <Input label="New Password" type="password" />
                  <Input label="Confirm New Password" type="password" />
                  <Button variant="primary">
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
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}


