'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Copy, Check, Type, Palette, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ProjectCardProps {
  id: string
  name: string
  domain?: string
  isActive?: boolean
  onDelete?: (id: string) => void
}

export function ProjectCard({
  id,
  name,
  domain,
  isActive = true,
  onDelete,
}: ProjectCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = async () => {
    // Placeholder — will be replaced with actual embed code
    const code = `<script src="https://cdn.floqly.ru/cookie.js" data-id="${id}"></script>`
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                <span className={`size-1.5 rounded-full ${isActive ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                <span className="text-[12px] text-muted-foreground">
                  {isActive ? 'Активна' : 'Неактивна'}
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

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
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
    </div>
  )
}
