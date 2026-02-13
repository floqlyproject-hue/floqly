'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, Settings, CreditCard, LogOut, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/providers/theme-provider'
import { createClient } from '@/lib/supabase/client'
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs'
import { MobileSidebar } from './sidebar'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/** SVG filter for liquid glass distortion — rendered once, hidden */
function LiquidGlassFilter() {
  return (
    <svg className="pointer-events-none absolute size-0" aria-hidden="true">
      <defs>
        <filter id="liquid-glass-header" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves="2"
            seed="42"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.5" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const breadcrumbs = useBreadcrumbs()

  return (
    <>
      <header className="liquid-glass-header sticky top-0 z-40 flex h-14 items-center justify-between px-4 sm:px-6">
        {/* SVG filter definition */}
        <LiquidGlassFilter />

        {/* Liquid glass distortion layer */}
        <div className="liquid-glass-distortion" />

        {/* Specular highlight overlay */}
        <div className="liquid-glass-specular" />

        {/* Left: mobile menu + breadcrumbs */}
        <div className="relative z-10 flex items-center gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground lg:hidden"
            aria-label="Открыть меню"
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>

          {/* Breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList className="text-[13px]">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1
                return (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right: theme toggle + user menu */}
        <div className="relative z-10 flex items-center gap-1">
          <ThemeButton />
          <UserMenu />
        </div>
      </header>

      {/* Mobile sidebar (Sheet) */}
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  )
}

// --- Compact theme toggle ---

function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Переключить тему"
    >
      <Sun className="size-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" strokeWidth={1.5} />
      <Moon className="absolute size-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" strokeWidth={1.5} />
    </button>
  )
}

// --- User dropdown ---

function UserMenu() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email)
      }
    })
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  // First letter for avatar
  const initial = userEmail ? userEmail[0].toUpperCase() : 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted"
          aria-label="Меню пользователя"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground">
            <span className="text-[12px] font-semibold">{initial}</span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-medium text-foreground">
              {userEmail || 'Пользователь'}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="size-4" />
              Настройки
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/subscription">
              <CreditCard className="size-4" />
              Подписка
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
