import { FloqlyLogo } from '@/components/floqly-logo'
import { MarketingHeader } from '@/components/marketing-header'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

      {children}

      {/* Marketing Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <FloqlyLogo variant="dots" size="sm" className="pointer-events-none" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Floqly. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
