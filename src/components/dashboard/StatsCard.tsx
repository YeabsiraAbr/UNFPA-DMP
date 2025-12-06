'use client'

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { Card } from '../ui/Card'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'brand' | 'emerald' | 'amber' | 'red' | 'purple'
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'brand',
  className,
}: StatsCardProps) {
  const colors = {
    brand: {
      bg: 'bg-brand-50 dark:bg-brand-900/30',
      icon: 'text-brand-600 dark:text-brand-400',
      ring: 'ring-brand-500/20',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      icon: 'text-emerald-600 dark:text-emerald-400',
      ring: 'ring-emerald-500/20',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      icon: 'text-amber-600 dark:text-amber-400',
      ring: 'ring-amber-500/20',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      icon: 'text-red-600 dark:text-red-400',
      ring: 'ring-red-500/20',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      icon: 'text-purple-600 dark:text-purple-400',
      ring: 'ring-purple-500/20',
    },
  }

  return (
    <Card variant="elevated" className={cn('card-hover', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn(
              'mt-2 text-sm font-medium',
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          'p-3 rounded-xl ring-1',
          colors[color].bg,
          colors[color].ring
        )}>
          <Icon className={cn('w-6 h-6', colors[color].icon)} />
        </div>
      </div>
    </Card>
  )
}



