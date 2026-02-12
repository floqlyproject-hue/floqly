import { InDevelopmentPage } from '@/components/dashboard/in-development-page'
import { Plug } from 'lucide-react'

export const metadata = {
  title: 'Интеграции | Floqly',
}

export default function IntegrationsPage() {
  return (
    <InDevelopmentPage
      title="Интеграции"
      description="Telegram, VK, Avito и другие каналы — подключите все площадки и получайте сообщения в одном месте."
      icon={<Plug className="size-10" strokeWidth={1} />}
    />
  )
}
