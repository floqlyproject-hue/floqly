import { ThemeToggle } from '@/components/theme-toggle'
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
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary" />
              <span className="text-xl font-semibold text-foreground">
                Floqly
              </span>
            </Link>

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
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Бесплатный инструмент от{' '}
              <Link href="/" className="font-medium text-foreground hover:text-primary">
                Floqly
              </Link>
            </p>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Войти для сохранения настроек
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
