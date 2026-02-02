'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from './utils'

interface DropdownProps {
  /** Триггер (кнопка) */
  trigger: React.ReactNode
  /** Содержимое меню */
  children: React.ReactNode
  /** Выравнивание: start | end | center */
  align?: 'start' | 'end' | 'center'
  /** Дополнительные классы для меню */
  className?: string
}

export function Dropdown({
  trigger,
  children,
  align = 'end',
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }, [])

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, handleClickOutside, handleEscape])

  const alignmentClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>

      {open && (
        <div
          className={cn(
            'absolute top-full z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card p-1 shadow-lg animate-slide-in',
            alignmentClasses[align],
            className
          )}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Иконка слева */
  icon?: React.ReactNode
  /** Деструктивный стиль (красный) */
  destructive?: boolean
}

export function DropdownItem({
  className,
  icon,
  destructive,
  children,
  ...props
}: DropdownItemProps) {
  return (
    <button
      role="menuitem"
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
        destructive
          ? 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10'
          : 'text-foreground hover:bg-muted focus:bg-muted',
        className
      )}
      {...props}
    >
      {icon && <span className="size-4">{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div className={cn('-mx-1 my-1 h-px bg-border', className)} />
}

export function DropdownLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)}
      {...props}
    />
  )
}
