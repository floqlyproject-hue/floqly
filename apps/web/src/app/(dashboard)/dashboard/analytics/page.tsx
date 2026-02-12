import { InDevelopmentPage } from '@/components/dashboard/in-development-page'
import { BarChart3 } from 'lucide-react'

export const metadata = {
  title: 'Аналитика | Floqly',
}

export default function AnalyticsPage() {
  return (
    <InDevelopmentPage
      title="Аналитика"
      description="Подробная статистика по всем вашим инструментам и виджетам. Конверсии, география, источники трафика."
      icon={<BarChart3 className="size-10" strokeWidth={1} />}
    />
  )
}
