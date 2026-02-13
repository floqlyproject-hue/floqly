import { ThemeToggle } from '@/components/theme-toggle'
import { FloqlyLogo } from '@/components/floqly-logo'
import Link from 'next/link'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Marketing Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <FloqlyLogo variant="line" size="md" />

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/tools/cookie-generator"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Cookie Generator
              </Link>
              <Link
                href="/tools/simple-widget"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Simple Widget
              </Link>
              <Link
                href="/#pricing"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Тарифы
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Войти
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Начать
            </Link>
          </div>
        </div>
      </header>

      {children}

      {/* Marketing Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <FloqlyLogo variant="line" size="sm" className="pointer-events-none" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Floqly. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
