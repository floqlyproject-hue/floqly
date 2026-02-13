import Link from 'next/link'
import { MarketingHeader } from '@/components/marketing-header'

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />

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
