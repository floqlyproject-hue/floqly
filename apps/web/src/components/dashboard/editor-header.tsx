'use client'

import Link from 'next/link'
import { ArrowLeft, RotateCcw, Check, Loader2 } from 'lucide-react'

interface EditorHeaderProps {
  title: string
  backHref: string
  backLabel?: string
  onSave: () => void
  onReset: () => void
  isSaving: boolean
  isDirty: boolean
}

export function EditorHeader({
  title,
  backHref,
  backLabel = 'Назад',
  onSave,
  onReset,
  isSaving,
  isDirty,
}: EditorHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          {backLabel}
        </Link>

        <div className="h-4 w-px bg-border" />

        <h1 className="text-[14px] font-semibold text-foreground">{title}</h1>

        {isDirty && (
          <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
            Не сохранено
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          onClick={onReset}
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" strokeWidth={1.5} />
          <span className="hidden sm:inline">Сбросить</span>
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
              Сохранение...
            </>
          ) : (
            <>
              <Check className="size-3.5" strokeWidth={2} />
              Сохранить
            </>
          )}
        </button>
      </div>
    </header>
  )
}
