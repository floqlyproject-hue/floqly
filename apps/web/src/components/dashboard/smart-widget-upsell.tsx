import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export function SmartWidgetUpsell() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
          <Sparkles className="size-4 text-foreground/50" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="text-[14px] font-medium text-foreground">
            Умный виджет
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            Виджет, который общается с посетителями 24/7, собирает заявки и повышает конверсию
          </p>

          <div className="mt-3.5 flex items-center gap-3">
            <Link
              href="/dashboard/widget"
              className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3.5 py-2 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
            >
              Подробнее
              <ArrowRight className="size-3.5" strokeWidth={1.5} />
            </Link>
            <span className="text-[12px] text-muted-foreground/60">
              7 дней бесплатно
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
