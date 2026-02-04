'use client'

import Link from 'next/link'
import { useProjectStore } from '@/lib/stores/project-store'

export default function SitesPage() {
  const projects = useProjectStore((state) => state.projects)
  const currentProjectId = useProjectStore((state) => state.currentProjectId)
  const setCurrentProjectId = useProjectStore((state) => state.setCurrentProjectId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Сайты</h1>
          <p className="mt-1 text-muted-foreground">
            Ваши подключённые сайты и их настройки
          </p>
        </div>
        <Link
          href="/dashboard/sites/new"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Добавить сайт
        </Link>
      </div>

      {/* Sites Grid */}
      {projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-200 hover:shadow-lg ${
                project.id === currentProjectId
                  ? 'border-primary/50 ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {/* Current badge */}
              {project.id === currentProjectId && (
                <div className="absolute right-3 top-3">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Активный
                  </span>
                </div>
              )}

              {/* Site Icon */}
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-lg font-bold">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                <p className="text-sm text-muted-foreground">{project.domain}</p>
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className={`size-2 rounded-full ${project.settings?.widget_installed ? 'bg-success' : 'bg-warning'}`} />
                  {project.settings?.widget_installed ? 'Виджет работает' : 'Виджет не установлен'}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <button
                  onClick={() => setCurrentProjectId(project.id)}
                  disabled={project.id === currentProjectId}
                  className="flex-1 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {project.id === currentProjectId ? 'Активен' : 'Сделать активным'}
                </button>
                <Link
                  href={`/dashboard/sites/${project.id}`}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
            <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-foreground">Пока нет сайтов</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Добавьте свой первый сайт, чтобы начать работу с Floqly
          </p>
          <Link
            href="/dashboard/sites/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Добавить сайт
          </Link>
        </div>
      )}
    </div>
  )
}
