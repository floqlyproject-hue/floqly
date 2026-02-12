import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export function SmartWidgetUpsell() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-foreground/40" strokeWidth={1.5} />
        <div className="flex-1">
          <h3 className="text-[15px] font-medium text-foreground">
            Умный виджет для вашего сайта
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            Отвечает на вопросы клиентов 24/7, собирает заявки и знает всё о вашем бизнесе.
            Работает на основе ваших данных — достаточно загрузить информацию о компании.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              href="/dashboard/widget"
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
            >
              Узнать подробнее
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Link>
            <span className="text-[12px] text-muted-foreground">
              7 дней бесплатно
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
