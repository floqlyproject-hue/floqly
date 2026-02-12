'use client'

import { Eye, CheckCircle2, XCircle, Percent } from 'lucide-react'

interface DashboardStatsProps {
  views: number
  accepts: number
  declines: number
  hasData: boolean
}

export function DashboardStats({ views, accepts, declines, hasData }: DashboardStatsProps) {
  const conversionRate = views > 0 ? Math.round((accepts / views) * 100) : null

  const stats = [
    {
      label: 'Показы',
      value: views,
      icon: Eye,
    },
    {
      label: 'Согласия',
      value: accepts,
      icon: CheckCircle2,
    },
    {
      label: 'Отказы',
      value: declines,
      icon: XCircle,
    },
    {
      label: 'Конверсия',
      value: conversionRate !== null ? `${conversionRate}%` : '—',
      icon: Percent,
    },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50">
        Статистика
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label}>
              <div className="flex items-center gap-2">
                <Icon className="size-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                <span className="text-[12px] text-muted-foreground">{stat.label}</span>
              </div>
              <p className="mt-1 text-[20px] font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      {!hasData && (
        <p className="mt-4 text-[12px] text-muted-foreground/60">
          Данные появятся после установки кода на сайт
        </p>
      )}
    </div>
  )
}
