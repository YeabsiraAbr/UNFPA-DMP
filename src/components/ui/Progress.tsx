'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gradient'
  showValue?: boolean
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, size = 'md', variant = 'default', showValue = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizes = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }

    const variants = {
      default: 'bg-brand-500',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      danger: 'bg-red-500',
      gradient: 'bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500',
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          className={cn(
            'w-full rounded-full overflow-hidden',
            'bg-slate-200 dark:bg-slate-700',
            sizes[size]
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              variants[variant]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <div className="flex justify-between mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>{value}</span>
            <span>{percentage.toFixed(0)}%</span>
          </div>
        )}
      </div>
    )
  }
)

Progress.displayName = 'Progress'

export { Progress }




