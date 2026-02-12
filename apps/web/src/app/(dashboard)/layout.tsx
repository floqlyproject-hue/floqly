import { Sidebar, Header } from '@/components/dashboard'
import { EmailConfirmBanner } from '@/components/dashboard/email-confirm-banner'
import { QueryProvider } from '@/contexts/query-provider'
import { ProjectProvider } from '@/contexts/project-context'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <ProjectProvider>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <Header />

            {/* Email Confirmation Banner */}
            <EmailConfirmBanner />

            {/* Page Content */}
            <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8">{children}</main>
          </div>
        </div>
      </ProjectProvider>
    </QueryProvider>
  )
}
