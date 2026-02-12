'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useProjects } from '@/lib/hooks/use-projects'
import { ProjectCard } from '@/components/dashboard/project-card'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'

export default function CookieGeneratorDashboardPage() {
  const { projects, isLoading, deleteProject } = useProjects()
  const hasProjects = projects.length > 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
          Плашка cookies
        </h1>
        <Link
          href="/dashboard/tools/cookie-generator/edit"
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
        >
          <Plus className="size-3.5" strokeWidth={1.5} />
          {hasProjects ? 'Создать новую' : 'Создать плашку'}
        </Link>
      </div>

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

          {/* Stats */}
          <DashboardStats
            views={0}
            accepts={0}
            declines={0}
            hasData={false}
          />
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <h2 className="text-[15px] font-medium text-foreground">
            У вас пока нет плашки cookies
          </h2>
          <p className="mt-2 max-w-sm text-[13px] text-muted-foreground">
            Уведомление о cookies нужно для соответствия 152-ФЗ. Настройте внешний вид и текст за пару минут.
          </p>
          <Link
            href="/dashboard/tools/cookie-generator/edit"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" strokeWidth={1.5} />
            Создать плашку
          </Link>
        </div>
      )}
    </div>
  )
}
