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
  /* Bubble SVG sizing — same proportions as widget Design-02
     viewBox 0 0 40 38, body Y 3→27 (center Y=15), tail to Y=33
     Optical centering: margin-top shifts bubble down so body center = icon center */
  const bubbleSvgW = size === 'sm' ? 15 : 17
  const bubbleSvgH = size === 'sm' ? 16 : 18
  const bubbleShift = size === 'sm' ? 2 : 2.5

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
        {/* Speech bubble — same SVG path as widget Design-02 */}
        <svg
          viewBox="0 0 40 38"
          fill="none"
          style={{
            width: bubbleSvgW,
            height: bubbleSvgH,
            marginTop: bubbleShift,
          }}
        >
          <path
            d="M3 33 V10 a7 7 0 0 1 7-7 h20 a7 7 0 0 1 7 7 v10 a7 7 0 0 1-7 7 H13 C9 27 5 30 3 33 Z"
            className="fl-logo-bubble-path"
            strokeWidth="2.3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        {/* Content overlay — shifted up 1px to center on bubble body */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ marginTop: -1 }}
        >
          {variant === 'line' ? (
            <div className="fl-logo-line-container relative flex items-center">
              <div className="fl-logo-line" />
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
