import { MarketingHeader } from '@/components/marketing-header'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark relative min-h-screen bg-black text-white">
      <MarketingHeader transparent />
      {children}
    </div>
  )
}
