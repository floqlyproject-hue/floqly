import { ThemeToggle } from '@/components/theme-toggle'
import { FloqlyLogo } from '@/components/floqly-logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Header — floating, minimal */}
      <header className="absolute top-0 right-0 left-0 z-10">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <FloqlyLogo variant="line" size="sm" />

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        {children}
      </main>

      {/* Background — subtle radial gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Top-right glow */}
        <div className="absolute -top-[300px] -right-[300px] size-[800px] rounded-full bg-primary/[0.04] blur-[120px]" />
        {/* Bottom-left glow */}
        <div className="absolute -bottom-[300px] -left-[300px] size-[800px] rounded-full bg-primary/[0.04] blur-[120px]" />
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>
    </div>
  )
}
