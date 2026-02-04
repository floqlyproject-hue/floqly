import { ComingSoonPage } from '@/components/dashboard/coming-soon-page'

export const metadata = {
  title: 'Диалоги | Floqly',
}

export default function DialogsPage() {
  return (
    <ComingSoonPage
      title="Диалоги"
      description="Все сообщения с ваших сайтов в одном месте. Отвечайте сами или доверьте это умному виджету — он справится с большинством вопросов."
      features={[
        'Единый центр сообщений',
        'Виджет отвечает за вас',
        'Передача в CRM',
        'Уведомления в Telegram',
      ]}
      accentColor="success"
      icon={
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
      }
      illustration={
        <div className="relative mx-auto max-w-md">
          {/* Chat Preview Placeholder */}
          <div className="rounded-2xl border border-border bg-card p-4 opacity-50">
            <div className="space-y-3">
              {/* Message 1 */}
              <div className="flex gap-3">
                <div className="size-8 shrink-0 rounded-full bg-primary/20" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Посетитель</span>
                    <span className="text-xs text-muted-foreground">2 мин назад</span>
                  </div>
                  <div className="rounded-xl rounded-tl-none bg-muted p-3 text-sm text-muted-foreground">
                    Здравствуйте! Подскажите, есть ли у вас доставка?
                  </div>
                </div>
              </div>
              {/* Message 2 */}
              <div className="flex gap-3">
                <div className="size-8 shrink-0 rounded-full bg-success/20" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">Умный виджет</span>
                    <span className="text-xs text-muted-foreground">1 мин назад</span>
                  </div>
                  <div className="rounded-xl rounded-tl-none bg-success/10 p-3 text-sm text-muted-foreground">
                    Да, мы доставляем по всей России! Сроки от 2 до 5 дней.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}
