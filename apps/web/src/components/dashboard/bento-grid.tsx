'use client'

import { type ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {children}
    </div>
  )
}

interface BentoCardProps {
  title: string
  description?: string
  icon?: ReactNode
  children?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'success' | 'warning'
  href?: string
}

export function BentoCard({
  title,
  description,
  icon,
  children,
  className = '',
  size = 'md',
  variant = 'default',
}: BentoCardProps) {
  const sizeClasses = {
    sm: 'col-span-1',
    md: 'col-span-1 sm:col-span-1',
    lg: 'col-span-1 sm:col-span-2',
    xl: 'col-span-1 sm:col-span-2 lg:col-span-2',
  }

  const variantClasses = {
    default: 'border-border bg-card',
    primary: 'border-primary/20 bg-primary/[0.03]',
    success: 'border-success/20 bg-success/[0.03]',
    warning: 'border-warning/20 bg-warning/[0.03]',
  }

  const iconVariantClasses = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.03] ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent dark:from-white/[0.01]" />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground/70">{description}</p>
            )}
          </div>
          {icon && (
            <div className={`flex size-10 items-center justify-center rounded-xl ${iconVariantClasses[variant]}`}>
              {icon}
            </div>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  )
}

// Stat Card - specialized card for displaying metrics
interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ title, value, change, icon, trend = 'neutral' }: StatCardProps) {
  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground',
  }

  const trendIcons = {
    up: (
      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
      </svg>
    ),
    down: (
      <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    ),
    neutral: null,
  }

  return (
    <BentoCard
      title={title}
      icon={icon}
      size="sm"
    >
      <div className="space-y-2">
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs ${trendColors[trend]}`}>
            {trendIcons[trend]}
            <span>{change.value > 0 ? '+' : ''}{change.value}%</span>
            <span className="text-muted-foreground">{change.label}</span>
          </div>
        )}
      </div>
    </BentoCard>
  )
}
