import { ComingSoonPage } from '@/components/dashboard/coming-soon-page'

export const metadata = {
  title: 'Интеграции | Floqly',
}

export default function IntegrationsPage() {
  return (
    <ComingSoonPage
      title="Интеграции"
      description="Подключите все каналы связи с клиентами. Telegram, VK, Avito — сообщения со всех площадок будут приходить в одно место."
      features={[
        'Telegram-бот для уведомлений',
        'Сообщения с Avito',
        'Группы ВКонтакте',
        'Webhooks для CRM',
      ]}
      accentColor="warning"
      icon={
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
      }
      illustration={
        <div className="relative mx-auto max-w-lg">
          {/* Channels Grid Placeholder */}
          <div className="grid grid-cols-2 gap-3 opacity-50">
            {/* Smart Widget */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Умный виджет</div>
                  <div className="text-xs text-muted-foreground">Чат на сайте</div>
                </div>
              </div>
            </div>

            {/* Telegram */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <svg className="size-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.94z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Telegram</div>
                  <div className="text-xs text-muted-foreground">Бот</div>
                </div>
              </div>
            </div>

            {/* Avito */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                  <span className="text-sm font-bold text-green-500">A</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">Avito</div>
                  <div className="text-xs text-muted-foreground">Сообщения</div>
                </div>
              </div>
            </div>

            {/* VK */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600/10">
                  <span className="text-sm font-bold text-blue-600">VK</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">ВКонтакте</div>
                  <div className="text-xs text-muted-foreground">Сообщества</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}
