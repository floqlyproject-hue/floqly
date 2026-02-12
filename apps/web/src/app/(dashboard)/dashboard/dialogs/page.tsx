import { InDevelopmentPage } from '@/components/dashboard/in-development-page'
import { MessageCircle } from 'lucide-react'

export const metadata = {
  title: 'Диалоги | Floqly',
}

export default function DialogsPage() {
  return (
    <InDevelopmentPage
      title="Диалоги"
      description="Все сообщения с ваших сайтов в одном месте. Отвечайте сами или доверьте это умному виджету."
      icon={<MessageCircle className="size-10" strokeWidth={1} />}
    />
  )
}
