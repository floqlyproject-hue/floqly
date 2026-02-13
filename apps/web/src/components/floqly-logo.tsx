'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FloqlyLogoProps {
  /** Вариант анимации: "line" (линия + курсор) или "dots" (три точки) */
  variant?: 'line' | 'dots'
  /** URL при клике */
  href?: string
  /** Дополнительные классы */
  className?: string
  /** Размер: "sm" для sidebar (28px), "md" для хедеров (32px) */
  size?: 'sm' | 'md'
}

export function FloqlyLogo({
  variant = 'dots',
  href = '/',
  className,
  size = 'sm',
}: FloqlyLogoProps) {
  const iconSize = size === 'sm' ? 28 : 32
  const textSize = size === 'sm' ? 'text-[15px]' : 'text-xl'
  const bubbleW = size === 'sm' ? 14 : 16
  const bubbleH = size === 'sm' ? 10 : 12

  return (
    <Link
      href={href}
      className={cn('fl-logo group inline-flex items-center gap-2.5', className)}
    >
      {/* Icon — square with rounded corners + speech bubble inside */}
      <div
        className="fl-logo-icon relative flex shrink-0 items-center justify-center rounded-[7px] border-[1.5px] transition-shadow duration-300"
        style={{ width: iconSize, height: iconSize }}
      >
        {/* Speech bubble */}
        <div
          className="relative flex items-center justify-center rounded-[5px_5px_5px_2px] border-[1.5px] transition-colors duration-300"
          style={{ width: bubbleW, height: bubbleH }}
        >
          {/* Content inside bubble */}
          {variant === 'line' ? (
            <div className="fl-logo-line-container relative flex items-center">
              {/* Static line → animated on hover */}
              <div className="fl-logo-line" />
              {/* Cursor — hidden by default, appears on hover */}
              <div className="fl-logo-cursor" />
            </div>
          ) : (
            <div className="fl-logo-dots flex items-center gap-[2px]">
              <span className="fl-logo-dot" style={{ animationDelay: '0ms' }} />
              <span className="fl-logo-dot" style={{ animationDelay: '300ms' }} />
              <span className="fl-logo-dot" style={{ animationDelay: '600ms' }} />
            </div>
          )}
        </div>
      </div>

      {/* Chevron — hidden, slides in on hover */}
      <span className="fl-logo-chevron" aria-hidden="true">
        &#x203A;
      </span>

      {/* Text "floqly" */}
      <span
        className={cn('fl-logo-text font-semibold tracking-tight transition-all duration-300', textSize)}
        style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
      >
        floqly
      </span>
    </Link>
  )
}
