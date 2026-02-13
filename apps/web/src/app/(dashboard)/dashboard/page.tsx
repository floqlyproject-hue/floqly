'use client'

import Link from 'next/link'
import { Plus, Cookie, ArrowRight } from 'lucide-react'
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
          <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
        <div className="h-20 animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <DashboardGreeting />

      {hasProjects ? (
        <>
          {/* Project cards */}
          <div className="space-y-2">
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

          {/* Smart Widget upsell */}
          <SmartWidgetUpsell />

          {/* More tools */}
          <ConnectMoreTools />
        </>
      ) : (
        /* ─── Empty state — new user, no projects ─── */
        <div className="space-y-8">
          {/* Primary CTA card */}
          <div className="rounded-xl border border-border bg-card p-8">
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-foreground/[0.05]">
                <Cookie className="size-6 text-foreground/40" strokeWidth={1.5} />
              </div>
              <h2 className="mt-5 text-[17px] font-semibold tracking-tight text-foreground">
                Начните с плашки cookies
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                Создайте плашку cookies для вашего сайта — это бесплатно и займёт пару минут.
                После этого подключите Умный виджет для работы с клиентами.
              </p>
              <Link
                href="/dashboard/tools/cookie-generator/edit"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
              >
                <Plus className="size-4" strokeWidth={1.5} />
                Создать плашку
              </Link>
            </div>
          </div>

          {/* Quick links — three steps */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50">
              Быстрый старт
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <QuickStartCard
                step={1}
                title="Плашка cookies"
                description="Соберите согласия по 152-ФЗ"
                href="/dashboard/tools/cookie-generator/edit"
              />
              <QuickStartCard
                step={2}
                title="Данные компании"
                description="Загрузите информацию о бизнесе"
                href="/dashboard/company-data"
              />
              <QuickStartCard
                step={3}
                title="Умный виджет"
                description="Подключите AI-помощника"
                href="/dashboard/widget"
              />
            </div>
          </div>

          {/* Smart Widget upsell */}
          <SmartWidgetUpsell />

          {/* More tools */}
          <ConnectMoreTools />
        </div>
      )}
    </div>
  )
}

/* ─── Quick start card ─── */

function QuickStartCard({
  step,
  title,
  description,
  href,
}: {
  step: number
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-foreground/10 hover:bg-muted/30"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06] text-[12px] font-semibold text-muted-foreground">
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-foreground">{title}</p>
        <p className="text-[12px] text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="size-3.5 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" strokeWidth={1.5} />
    </Link>
  )
}
