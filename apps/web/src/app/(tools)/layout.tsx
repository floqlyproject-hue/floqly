import { ThemeToggle } from '@/components/theme-toggle'
import { FloqlyLogo } from '@/components/floqly-logo'
import Link from 'next/link'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Tools Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <FloqlyLogo variant="dots" size="md" />

            <span className="hidden text-muted-foreground sm:block">/</span>

            <span className="hidden text-sm text-muted-foreground sm:block">
              Инструменты
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Личный кабинет
            </Link>
          </div>
        </div>
      </header>

      {children}

      {/* Tools Footer */}
      <footer>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="text-[13px] text-muted-foreground/50 transition-colors hover:text-foreground">
              Floqly
            </Link>
            <Link
              href="/dashboard"
              className="text-[13px] text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              Личный кабинет
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
