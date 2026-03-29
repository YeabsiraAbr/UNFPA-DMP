'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Search,
  Bell,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  RefreshCcw,
  ChevronDown,
  Globe,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Input } from '../ui/Input'
import { Avatar } from '../ui/Avatar'
import { useRouter } from 'next/navigation'
import { profileService, clearCache } from '@/services'

const fallbackUser = {
  id: '',
  name: 'User',
  email: '',
  role: 'admin' as const,
  lastActive: '',
  status: 'online' as const,
}
const syncStatus = { isOnline: true, pendingUploads: 0 }
const alerts: {
  id: string
  title: string
  message: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  readAt: string | null
  createdAt: string
}[] = []
import { formatRelativeTime } from '@/lib/utils'
import { useTranslation, LOCALE_LABELS, type Locale } from '@/lib/i18n'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter()
  const { t, locale, setLocale } = useTranslation()
  const [isDark, setIsDark] = useState(false)
  const [cacheRefreshing, setCacheRefreshing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const [currentUser, setCurrentUser] = useState(fallbackUser)

  useEffect(() => {
    profileService.getMe().then(res => {
      if (res.success && res.profile) {
        setCurrentUser({
          id: res.profile.id,
          name: res.profile.fullName || fallbackUser.name,
          email: fallbackUser.email,
          role: fallbackUser.role,
          lastActive: new Date().toISOString(),
          status: 'online' as const,
        })
      }
    }).catch(() => {})
  }, [])

  const unreadAlerts = alerts.filter(a => !a.readAt).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    if (newIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:block w-64">
              <Input
                placeholder={t('header.searchPlaceholder')}
                icon={Search}
                className="bg-slate-100 dark:bg-slate-800 border-0"
              />
            </div>

            {/* Sync Status */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              syncStatus.isOnline
                ? 'bg-emerald-100 dark:bg-emerald-900/30'
                : 'bg-red-100 dark:bg-red-900/30'
            )}>
              {syncStatus.isOnline ? (
                <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span className={cn(
                'text-sm font-medium',
                syncStatus.isOnline
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-red-700 dark:text-red-400'
              )}>
                {syncStatus.isOnline ? t('header.online') : t('header.offline')}
              </span>
              {syncStatus.pendingUploads > 0 && (
                <Badge variant="warning" size="sm">
                  {syncStatus.pendingUploads} {t('header.pending')}
                </Badge>
              )}
            </div>

            {/* Clear in-memory API cache + refresh Next.js server tree */}
            <button
              type="button"
              title={t('header.refreshCache')}
              onClick={() => {
                setCacheRefreshing(true)
                clearCache()
                router.refresh()
                window.setTimeout(() => setCacheRefreshing(false), 600)
              }}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              <RefreshCcw className={cn('w-5 h-5', cacheRefreshing && 'animate-spin')} />
            </button>

            {/* Language Switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  {LOCALE_LABELS[locale]}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-down z-50">
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {t('header.language')}
                    </p>
                  </div>
                  {(Object.entries(LOCALE_LABELS) as [Locale, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setLocale(key)
                        setShowLangMenu(false)
                      }}
                      className={cn(
                        'w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between',
                        locale === key
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-medium'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      )}
                    >
                      {label}
                      {locale === key && (
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                    {unreadAlerts}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-down z-50">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{t('header.notifications')}</h3>
                    <p className="text-sm text-slate-500">{unreadAlerts} {t('header.unreadAlerts')}</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={cn(
                          'px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer',
                          !alert.readAt && 'bg-brand-50/50 dark:bg-brand-900/20'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-2 h-2 mt-2 rounded-full flex-shrink-0',
                            alert.priority === 'critical' && 'bg-red-500',
                            alert.priority === 'high' && 'bg-orange-500',
                            alert.priority === 'medium' && 'bg-yellow-500',
                            alert.priority === 'low' && 'bg-green-500'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {alert.title}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                              {alert.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatRelativeTime(alert.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900">
                    <a href="/dashboard/alerts" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
                      {t('header.viewAllNotifications')}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <button className="flex items-center gap-2 p-1.5 pr-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <Avatar fallback={currentUser.name} size="sm" status={currentUser.status} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:block">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

