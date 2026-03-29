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
import { Modal } from '@/components/ui/Modal'
import { profileService, authService, rolesService, roleNameForApi, userService, clearCache } from '@/services'
import type { Profile, Role, User } from '@/services/types'

function profileToUser(p: Profile): User | null {
  const id = String(p.id ?? '').trim()
  if (!id) return null
  const meta = p as Record<string, unknown>
  const created = typeof meta.createdAt === 'string' ? meta.createdAt : new Date().toISOString()
  return {
    id,
    phone: p.phone || '',
    fullName: p.fullName,
    isActive: true,
    createdAt: created,
  }
}

function mergeUserLists(...groups: User[][]): User[] {
  const map = new Map<string, User>()
  for (const g of groups) {
    for (const u of g) {
      if (u.id) map.set(u.id, u)
    }
  }
  return Array.from(map.values())
}
import {
  Settings,
  User as UserIcon,
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
  CheckCircle2,
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

  const [directoryUsers, setDirectoryUsers] = useState<User[]>([])
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserForm, setNewUserForm] = useState({ fullName: '', phone: '', password: '' })
  const [addUserSubmitting, setAddUserSubmitting] = useState(false)
  const [addUserError, setAddUserError] = useState('')

  const [assignRole, setAssignRole] = useState<Role | null>(null)
  const [assignUserId, setAssignUserId] = useState('')
  const [assignSubmitting, setAssignSubmitting] = useState(false)
  const [assignError, setAssignError] = useState('')

  const [removeRole, setRemoveRole] = useState<Role | null>(null)
  const [removeUserId, setRemoveUserId] = useState('')
  const [removeSubmitting, setRemoveSubmitting] = useState(false)
  const [removeError, setRemoveError] = useState('')

  const [roleAssignSuccess, setRoleAssignSuccess] = useState<{ userId: string; roleName: string } | null>(null)

  const [loadingDirectoryUsers, setLoadingDirectoryUsers] = useState(true)
  const [directoryUsersError, setDirectoryUsersError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadDirectoryUsers() {
      setLoadingDirectoryUsers(true)
      setDirectoryUsersError('')
      const messages: string[] = []
      try {
        const [listOutcome, meOutcome] = await Promise.allSettled([userService.list(), profileService.getMe()])
        if (cancelled) return

        const fromList =
          listOutcome.status === 'fulfilled' ? (listOutcome.value.users ?? []) : []
        if (listOutcome.status === 'rejected') {
          const err = listOutcome.reason
          messages.push(err instanceof Error ? err.message : 'Could not load user directory from the API.')
        }

        let me: User | null = null
        if (meOutcome.status === 'fulfilled' && meOutcome.value.success) {
          const p = meOutcome.value.profile
          setProfile({
            name: p.fullName || '',
            phone: p.phone || '',
            role: 'doctor',
          })
          me = profileToUser(p)
          if (!me) {
            messages.push(
              'Your profile response did not include a user id. Ensure GET /profile/me returns id or userId.'
            )
          }
        } else if (meOutcome.status === 'rejected') {
          const err = meOutcome.reason
          messages.push(err instanceof Error ? err.message : 'Could not load your profile (GET /profile/me).')
        }

        setDirectoryUsers((prev) => mergeUserLists(fromList, me ? [me] : [], prev))
        if (messages.length && !cancelled) setDirectoryUsersError(messages.join(' '))
      } catch (e) {
        if (!cancelled) {
          setDirectoryUsersError(e instanceof Error ? e.message : 'Failed to load users.')
        }
      } finally {
        if (!cancelled) setLoadingDirectoryUsers(false)
      }
    }

    loadDirectoryUsers()

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

    return () => {
      cancelled = true
    }
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

  const openAddUserModal = () => {
    setAddUserError('')
    setNewUserForm({ fullName: '', phone: '', password: '' })
    setShowAddUserModal(true)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddUserError('')
    const { fullName, phone, password } = newUserForm
    if (!fullName.trim() || !phone.trim() || !password) {
      setAddUserError('Please fill in full name, phone, and password.')
      return
    }
    if (fullName.trim().length < 4) {
      setAddUserError('Full name must be at least 4 characters.')
      return
    }
    if (password.length < 4) {
      setAddUserError('Password must be at least 4 characters.')
      return
    }
    setAddUserSubmitting(true)
    try {
      const { user } = await authService.register({
        fullName: fullName.trim(),
        phone: phone.trim(),
        password,
      })
      setDirectoryUsers((prev) => (prev.some((u) => u.id === user.id) ? prev : [user, ...prev]))
      setShowAddUserModal(false)
      setNewUserForm({ fullName: '', phone: '', password: '' })
    } catch (err) {
      setAddUserError(err instanceof Error ? err.message : 'Registration failed.')
    } finally {
      setAddUserSubmitting(false)
    }
  }

  const openAssignModal = (role: Role) => {
    setAssignError('')
    setAssignUserId('')
    setAssignRole(role)
  }

  const submitAssignRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignRole) return
    const userId = assignUserId.trim()
    if (!userId) {
      setAssignError('Please enter a user ID.')
      return
    }
    setAssignSubmitting(true)
    setAssignError('')
    try {
      const res = await rolesService.assign(userId, roleNameForApi(assignRole))
      if (!res.success) {
        setAssignError('Role assignment was not successful.')
        return
      }
      setAssignRole(null)
      setAssignUserId('')
      if (res.result) {
        setRoleAssignSuccess({ userId: res.result.userId, roleName: res.result.roleName })
      } else {
        setRoleAssignSuccess({ userId, roleName: roleNameForApi(assignRole) })
      }
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : 'Failed to assign role.')
    } finally {
      setAssignSubmitting(false)
    }
  }

  const openRemoveModal = (role: Role) => {
    setRemoveError('')
    setRemoveUserId('')
    setRemoveRole(role)
  }

  const submitRemoveRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!removeRole) return
    const userId = removeUserId.trim()
    if (!userId) {
      setRemoveError('Please enter a user ID.')
      return
    }
    setRemoveSubmitting(true)
    setRemoveError('')
    try {
      await rolesService.remove(userId, roleNameForApi(removeRole))
      setRemoveRole(null)
      setRemoveUserId('')
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : 'Failed to remove role.')
    } finally {
      setRemoveSubmitting(false)
    }
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
                  <UserIcon className="w-5 h-5 text-brand-500" />
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
              <Button variant="primary" onClick={openAddUserModal}>
                <Plus className="w-4 h-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              {directoryUsersError && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm">
                  {directoryUsersError}
                </div>
              )}
              {loadingDirectoryUsers ? (
                <p className="text-sm text-slate-500 text-center py-8">Loading users…</p>
              ) : directoryUsers.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No users yet. Add a user with the button above.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                        <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">User ID</th>
                        <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Name</th>
                        <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-300">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {directoryUsers.map((u) => (
                        <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <td className="p-3 font-mono text-xs text-slate-600 dark:text-slate-400">{u.id}</td>
                          <td className="p-3 text-slate-900 dark:text-white">{u.fullName ?? '—'}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-400">{u.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Modal
            isOpen={showAddUserModal}
            onClose={() => !addUserSubmitting && setShowAddUserModal(false)}
            title="Add user"
            description="Creates an account via POST /auth/register (same as public registration)."
            size="md"
          >
            <form onSubmit={handleAddUser} className="space-y-4 -mt-2">
              {addUserError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {addUserError}
                </div>
              )}
              <Input
                label="Full name"
                value={newUserForm.fullName}
                onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                autoComplete="name"
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="+251911234567"
                value={newUserForm.phone}
                onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                autoComplete="tel"
              />
              <Input
                label="Password"
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                autoComplete="new-password"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowAddUserModal(false)} disabled={addUserSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={addUserSubmitting}>
                  Create user
                </Button>
              </div>
            </form>
          </Modal>

          <Modal
            isOpen={assignRole !== null}
            onClose={() => !assignSubmitting && setAssignRole(null)}
            title="Assign role"
            description={assignRole ? `Grant “${assignRole.name}” to a user by ID.` : undefined}
            size="sm"
          >
            <form onSubmit={submitAssignRole} className="space-y-4 -mt-2">
              {assignError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {assignError}
                </div>
              )}
              <Input
                label="User ID"
                placeholder="Paste UUID from the table above"
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                className="font-mono text-sm"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setAssignRole(null)} disabled={assignSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={assignSubmitting}>
                  Assign
                </Button>
              </div>
            </form>
          </Modal>

          <Modal
            isOpen={roleAssignSuccess !== null}
            onClose={() => setRoleAssignSuccess(null)}
            title="Role assigned"
            description="The server confirmed this assignment."
            size="sm"
          >
            {roleAssignSuccess && (
              <div className="space-y-4 -mt-2">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm min-w-0">
                    <p className="text-slate-600 dark:text-slate-400">
                      <span className="font-medium text-slate-700 dark:text-slate-300">User ID</span>
                    </p>
                    <p className="font-mono text-xs text-slate-900 dark:text-white break-all">{roleAssignSuccess.userId}</p>
                    <p className="text-slate-600 dark:text-slate-400 pt-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Role</span>
                    </p>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">{roleAssignSuccess.roleName}</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" onClick={() => setRoleAssignSuccess(null)}>
                    OK
                  </Button>
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={removeRole !== null}
            onClose={() => !removeSubmitting && setRemoveRole(null)}
            title="Remove role from user"
            description={removeRole ? `Remove “${removeRole.name}” from the user with this ID.` : undefined}
            size="sm"
          >
            <form onSubmit={submitRemoveRole} className="space-y-4 -mt-2">
              {removeError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                  {removeError}
                </div>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                This calls the role remove API. Make sure the user ID is correct.
              </p>
              <Input
                label="User ID"
                placeholder="Paste UUID"
                value={removeUserId}
                onChange={(e) => setRemoveUserId(e.target.value)}
                className="font-mono text-sm"
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={() => setRemoveRole(null)} disabled={removeSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger" isLoading={removeSubmitting}>
                  Remove role
                </Button>
              </div>
            </form>
          </Modal>

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
                        <Button variant="outline" size="sm" onClick={() => openAssignModal(role)}>
                          Assign
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500"
                          onClick={() => openRemoveModal(role)}
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
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      if (!window.confirm('Reload the app and clear in-memory API cache? Unsaved work in other tabs may be lost.')) return
                      clearCache()
                      window.location.reload()
                    }}
                  >
                    <RefreshCcw className="w-4 h-4" />
                    Force Sync All Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      clearCache()
                    }}
                  >
                    <Database className="w-4 h-4" />
                    Clear Local Cache
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-amber-600"
                    onClick={() => {
                      clearCache('dashboard-stats')
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    Reset Risk Rules
                  </Button>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      variant="danger"
                      className="w-full"
                      onClick={() => {
                        if (!window.confirm('Clear in-memory cache and non-auth browser storage for this app? You will stay signed in.')) return
                        clearCache()
                        const keep = new Set([
                          'unfpa_access_token',
                          'unfpa_refresh_token',
                          'isLoggedIn',
                          'unfpa_user_id',
                        ])
                        try {
                          for (let i = localStorage.length - 1; i >= 0; i--) {
                            const k = localStorage.key(i)
                            if (k && !keep.has(k)) localStorage.removeItem(k)
                          }
                        } catch {
                          /* ignore */
                        }
                      }}
                    >
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




