import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary" />
            <span className="text-xl font-semibold text-foreground">
              Floqly
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center px-4 py-20">
        {children}
      </main>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 size-[1000px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 size-[1000px] rounded-full bg-primary/5 blur-3xl" />
      </div>
    </div>
  )
}
