'use client'

import Link from 'next/link'
import { Plus, Shield } from 'lucide-react'
import { useProjects } from '@/lib/hooks/use-projects'
import { DashboardGreeting } from '@/components/dashboard/dashboard-greeting'
import { ProjectCard } from '@/components/dashboard/project-card'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { SmartWidgetUpsell } from '@/components/dashboard/smart-widget-upsell'
import { ConnectMoreTools } from '@/components/dashboard/connect-more-tools'

export default function DashboardPage() {
  const { projects, isLoading, deleteProject } = useProjects()
  const hasProjects = projects.length > 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 h-5 w-72 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <DashboardGreeting />

      {hasProjects ? (
        <>
          {/* Project cards */}
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name="Плашка cookies"
                domain={project.domain}
                isActive={true}
                onDelete={(id) => deleteProject(id)}
              />
            ))}
          </div>

          {/* Stats (placeholder zeros for now) */}
          <DashboardStats
            views={0}
            accepts={0}
            declines={0}
            hasData={false}
          />

          {/* Smart Widget upsell */}
          <SmartWidgetUpsell />

          {/* Connect more tools */}
          <ConnectMoreTools />
        </>
      ) : (
        /* Empty state — no projects */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <Shield className="size-10 text-muted-foreground/30" strokeWidth={1} />
          <h2 className="mt-4 text-[18px] font-semibold text-foreground">
            Добро пожаловать в Floqly
          </h2>
          <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted-foreground">
            Начните с создания плашки cookies для вашего сайта — это бесплатно и займёт пару минут
          </p>
          <Link
            href="/dashboard/tools/cookie-generator/edit"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" strokeWidth={1.5} />
            Создать плашку cookies
          </Link>

          {/* Still show upsell & tools even in empty state */}
          <div className="mt-12 w-full max-w-2xl space-y-6 text-left">
            <SmartWidgetUpsell />
            <ConnectMoreTools />
          </div>
        </div>
      )}
    </div>
  )
}
