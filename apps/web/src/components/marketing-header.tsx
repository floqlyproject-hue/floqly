'use client'

import Link from 'next/link'
import { useTheme } from '@/providers/theme-provider'
import { FloqlyLogo } from '@/components/floqly-logo'
import { cn } from '@/lib/utils'

interface MarketingHeaderProps {
  /** Fully transparent header (no bg, no border) — for hero pages */
  transparent?: boolean
}

/**
 * Marketing Header — единый хедер для marketing + tools страниц
 * Схема: [Logo] ——————— [🌙] [👤 Войти] [☰]
 * Минимализм + премиальность, стиль Linear/Vercel
 */
export function MarketingHeader({ transparent }: MarketingHeaderProps = {}) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50',
        transparent
          ? 'bg-transparent'
          : 'border-b border-border/50 bg-background/80 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left — Logo */}
        <FloqlyLogo variant="dots" size="sm" />

        {/* Right — actions */}
        <div className="flex items-center gap-1">
          <ThemeToggleIcon transparent={transparent} />
          <LoginButton transparent={transparent} />
          <BurgerButton transparent={transparent} />
        </div>
      </div>
    </header>
  )
}

/* ─── Theme Toggle — clean icon button ─── */

function ThemeToggleIcon({ transparent }: { transparent?: boolean } = {}) {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex size-9 items-center justify-center rounded-full',
        'transition-all duration-200 active:scale-95',
        transparent
          ? 'text-white/70 hover:bg-white/10 hover:text-white'
          : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground',
      )}
      aria-label="Переключить тему"
    >
      {/* Sun */}
      <svg
        className="size-[18px] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
      {/* Moon */}
      <svg
        className="absolute size-[18px] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
  )
}

/* ─── Login — icon + text on desktop, icon-only on mobile ─── */

function LoginButton({ transparent }: { transparent?: boolean } = {}) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'inline-flex h-9 items-center gap-2 rounded-full px-3',
        'text-[13px] font-medium',
        'transition-all duration-200 active:scale-95',
        transparent
          ? 'text-white/70 hover:bg-white/10 hover:text-white'
          : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground',
      )}
    >
      {/* User icon */}
      <svg
        className="size-[18px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
      </svg>
      <span className="hidden sm:block">Войти</span>
    </Link>
  )
}

/* ─── Burger — menu trigger ─── */

function BurgerButton({ transparent }: { transparent?: boolean } = {}) {
  return (
    <button
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full',
        'transition-all duration-200 active:scale-95',
        transparent
          ? 'text-white/70 hover:bg-white/10 hover:text-white'
          : 'text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground',
      )}
      aria-label="Открыть меню"
    >
      {/* 3-line burger — тонкие линии, premium feel */}
      <svg
        className="size-[18px]"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <line x1="2" y1="4.5" x2="16" y2="4.5" />
        <line x1="2" y1="9" x2="16" y2="9" />
        <line x1="2" y1="13.5" x2="16" y2="13.5" />
      </svg>
    </button>
  )
}
