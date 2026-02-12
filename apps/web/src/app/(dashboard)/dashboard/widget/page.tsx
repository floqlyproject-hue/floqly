import { InDevelopmentPage } from '@/components/dashboard/in-development-page'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Умный виджет | Floqly',
}

export default function WidgetPage() {
  return (
    <InDevelopmentPage
      title="Умный виджет"
      description="AI-чат для вашего сайта, который сам отвечает на вопросы клиентов, собирает заявки и работает 24/7."
      icon={<Sparkles className="size-10" strokeWidth={1} />}
    />
  )
}
