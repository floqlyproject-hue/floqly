import { ComingSoonPage } from '@/components/dashboard/coming-soon-page'

export const metadata = {
  title: 'Умный виджет | Floqly',
}

export default function WidgetPage() {
  return (
    <ComingSoonPage
      title="Умный виджет"
      description="Чат для вашего сайта, который сам отвечает на вопросы клиентов. Работает круглосуточно, знает всё о вашем бизнесе и собирает заявки."
      features={[
        'Отвечает на вопросы 24/7',
        'Знает всё о вашем бизнесе',
        'Передаёт сложные вопросы вам',
        'Собирает контакты клиентов',
      ]}
      accentColor="primary"
      icon={
        <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      }
      illustration={
        <div className="relative mx-auto max-w-sm">
          {/* Widget Preview */}
          <div className="rounded-2xl border border-border bg-card p-4 opacity-60">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Помощник</div>
                <div className="text-xs text-success">Онлайн</div>
              </div>
            </div>
            <div className="space-y-3 py-4">
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-muted p-3 text-sm text-muted-foreground">
                  Здравствуйте! Чем могу помочь?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-primary/10 p-3 text-sm text-foreground">
                  Сколько стоит доставка?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-muted p-3 text-sm text-muted-foreground">
                  Доставка по Москве бесплатная при заказе от 3000 руб. В регионы — от 350 руб.
                </div>
              </div>
            </div>
            <div className="flex gap-2 border-t border-border pt-3">
              <div className="flex-1 rounded-xl bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                Введите сообщение...
              </div>
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      }
    />
  )
}
