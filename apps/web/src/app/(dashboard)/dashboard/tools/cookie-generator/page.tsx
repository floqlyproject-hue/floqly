'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useProjects } from '@/lib/hooks/use-projects'
import { useWidget } from '@/lib/hooks/use-widget'
import { useWidgetStats, useWidgetAnalytics } from '@/lib/hooks/use-widget-stats'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { ProjectCard } from '@/components/dashboard/project-card'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'

export default function CookieGeneratorDashboardPage() {
  const { projects, isLoading, deleteProject } = useProjects()
  const hasProjects = projects.length > 0

  // Load widget for first project
  const firstProjectId = projects[0]?.id ?? null
  const { widget } = useWidget(firstProjectId)

  // Stats
  const { data: stats } = useWidgetStats(widget?.id)
  const { data: analytics } = useWidgetAnalytics(widget?.id)

  // Toggle widget status mutation
  const supabase = createClient()
  const queryClient = useQueryClient()
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ widgetId, newStatus }: { widgetId: string; newStatus: 'active' | 'paused' }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('widgets')
        .update({
          status: newStatus,
          ...(newStatus === 'active' ? { published_at: new Date().toISOString() } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', widgetId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widget'] })
    },
  })

  const handleToggleStatus = (widgetId: string, newStatus: 'active' | 'paused') => {
    toggleStatusMutation.mutate({ widgetId, newStatus })
  }

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
                widgetId={project.id === firstProjectId ? widget?.id : undefined}
                embedKey={project.id === firstProjectId ? widget?.embed_key : undefined}
                widgetStatus={project.id === firstProjectId ? widget?.status : 'draft'}
                onDelete={(id) => deleteProject(id)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>

          {/* Stats */}
          <DashboardStats
            views={stats?.views_count ?? 0}
            accepts={analytics?.accepts ?? 0}
            declines={analytics?.declines ?? 0}
            hasData={(stats?.views_count ?? 0) > 0}
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
