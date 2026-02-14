'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Shield, Copy, Check, Type, Palette, MoreHorizontal,
  Plus, Trash2, Play, Pause, Eye, MousePointerClick,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWidgetStats, useWidgetAnalytics } from '@/lib/hooks/use-widget-stats'

interface ProjectCardProps {
  id: string
  name: string
  domain?: string
  widgetId?: string
  embedKey?: string
  widgetStatus?: 'draft' | 'active' | 'paused' | 'archived'
  onDelete?: (id: string) => void
  onToggleStatus?: (widgetId: string, newStatus: 'active' | 'paused') => void
}

/** Generates the CDN embed code for a widget */
function getEmbedCode(embedKey: string): string {
  return `<script src="https://cdn.floqly.ru/embed/v1/fl-helper.iife.js" data-widget-id="${embedKey}"></script>`
}

export function ProjectCard({
  id,
  name,
  domain,
  widgetId,
  embedKey,
  widgetStatus = 'draft',
  onDelete,
  onToggleStatus,
}: ProjectCardProps) {
  const [copied, setCopied] = useState(false)

  // Stats hooks
  const { data: stats } = useWidgetStats(widgetId)
  const { data: analytics } = useWidgetAnalytics(widgetId)

  const isActive = widgetStatus === 'active'
  const isPublished = widgetStatus === 'active' || widgetStatus === 'paused'

  const handleCopyCode = async () => {
    if (!embedKey) return
    const code = getEmbedCode(embedKey)
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToggleStatus = () => {
    if (!widgetId || !onToggleStatus) return
    onToggleStatus(widgetId, isActive ? 'paused' : 'active')
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Shield className="size-5 text-foreground/60" strokeWidth={1.5} />
          <div>
            <h3 className="text-[15px] font-medium text-foreground">{name}</h3>
            <div className="mt-0.5 flex items-center gap-2">
              {domain ? (
                <span className="text-[13px] text-muted-foreground">{domain}</span>
              ) : (
                <span className="text-[13px] text-muted-foreground/50">Не привязана к сайту</span>
              )}
              <span className="text-muted-foreground/30">·</span>
              <div className="flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full ${
                  isActive ? 'bg-success' :
                  widgetStatus === 'paused' ? 'bg-amber-400' :
                  'bg-muted-foreground/30'
                }`} />
                <span className="text-[12px] text-muted-foreground">
                  {isActive ? 'Активна' :
                   widgetStatus === 'paused' ? 'На паузе' :
                   widgetStatus === 'draft' ? 'Черновик' : 'Неактивна'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="size-4" strokeWidth={1.5} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isPublished && (
              <DropdownMenuItem onClick={handleToggleStatus}>
                {isActive ? (
                  <>
                    <Pause className="size-4" />
                    Приостановить
                  </>
                ) : (
                  <>
                    <Play className="size-4" />
                    Активировать
                  </>
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/dashboard/tools/cookie-generator/edit">
                <Plus className="size-4" />
                Создать ещё
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete?.(id)}
            >
              <Trash2 className="size-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats row (only when published) */}
      {isPublished && stats && (
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Eye className="size-3.5 text-muted-foreground/40" strokeWidth={1.5} />
            <span className="text-[12px] tabular-nums text-muted-foreground">
              {stats.views_count.toLocaleString('ru-RU')} показов
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MousePointerClick className="size-3.5 text-muted-foreground/40" strokeWidth={1.5} />
            <span className="text-[12px] tabular-nums text-muted-foreground">
              {(analytics?.accepts ?? 0).toLocaleString('ru-RU')} согласий
            </span>
          </div>
          {(analytics?.declines ?? 0) > 0 && (
            <span className="text-[12px] tabular-nums text-muted-foreground/50">
              {analytics!.declines.toLocaleString('ru-RU')} отказов
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {/* Copy embed code — only show when widget has embed_key */}
        {embedKey ? (
          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            {copied ? (
              <>
                <Check className="size-3.5" strokeWidth={2} />
                Скопировано
              </>
            ) : (
              <>
                <Copy className="size-3.5" strokeWidth={1.5} />
                Скопировать код
              </>
            )}
          </button>
        ) : (
          /* Publish button for drafts */
          <button
            onClick={handleToggleStatus}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            <Play className="size-3.5" strokeWidth={1.5} />
            Опубликовать
          </button>
        )}

        <Link
          href="/dashboard/tools/cookie-generator/edit/text"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Type className="size-3.5" strokeWidth={1.5} />
          Текст
        </Link>

        <Link
          href="/dashboard/tools/cookie-generator/edit/design"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Palette className="size-3.5" strokeWidth={1.5} />
          Дизайн
        </Link>
      </div>

      {/* Embed code preview (compact, when active) */}
      {embedKey && isPublished && (
        <div className="mt-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <code className="block truncate font-mono text-[11px] text-muted-foreground">
            {getEmbedCode(embedKey)}
          </code>
        </div>
      )}
    </div>
  )
}
