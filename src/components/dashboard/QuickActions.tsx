'use client'

import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import {
  UserPlus,
  CalendarPlus,
  ScanLine,
  MessageSquarePlus,
  FileText,
  Upload,
} from 'lucide-react'

const actions = [
  {
    name: 'Register Patient',
    description: 'Add new maternal patient',
    icon: UserPlus,
    href: '/dashboard/patients/new',
    color: 'from-brand-500 to-brand-600',
  },
  {
    name: 'Record Visit',
    description: 'Log prenatal checkup',
    icon: CalendarPlus,
    href: '/dashboard/prenatal/new',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    name: 'Capture Ultrasound',
    description: 'Upload scan images',
    icon: ScanLine,
    href: '/dashboard/ultrasound/new',
    color: 'from-purple-500 to-purple-600',
  },
  {
    name: 'Request Teleconsult',
    description: 'Connect with specialist',
    icon: MessageSquarePlus,
    href: '/dashboard/teleconsult/new',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'GBV Intake',
    description: 'Secure case reporting',
    icon: FileText,
    href: '/dashboard/gbv/new',
    color: 'from-amber-500 to-amber-600',
  },
  {
    name: 'Manual Sync',
    description: 'Upload pending data',
    icon: Upload,
    href: '/dashboard/sync',
    color: 'from-slate-500 to-slate-600',
  },
]

export function QuickActions() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <a
              key={action.name}
              href={action.href}
              className={cn(
                'group relative p-4 rounded-xl overflow-hidden transition-all duration-300',
                'bg-gradient-to-br hover:scale-[1.02] hover:shadow-lg',
                action.color,
                'animate-scale-in'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative z-10">
                <action.icon className="w-6 h-6 text-white mb-2" />
                <h3 className="text-sm font-semibold text-white">{action.name}</h3>
                <p className="text-xs text-white/80 mt-0.5">{action.description}</p>
              </div>
              {/* Decorative element */}
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-500" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}



