import Link from 'next/link'
import { FileText, PhoneCall, MessageSquare, ArrowRight } from 'lucide-react'

const tools = [
  {
    name: 'Политика конфиденциальности',
    description: 'Генератор документа',
    icon: FileText,
  },
  {
    name: 'Обратный звонок',
    description: 'Виджет для сайта',
    icon: PhoneCall,
  },
  {
    name: 'Простой виджет',
    description: 'Кнопка связи',
    icon: MessageSquare,
  },
]

export function ConnectMoreTools() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50">
          Подключить ещё
        </p>
        <Link
          href="/dashboard/tools"
          className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Все инструменты
          <ArrowRight className="size-3" strokeWidth={1.5} />
        </Link>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <div
              key={tool.name}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 opacity-60"
            >
              <Icon className="size-5 shrink-0 text-muted-foreground/40" strokeWidth={1.5} />
              <div>
                <p className="text-[13px] font-medium text-foreground">{tool.name}</p>
                <p className="text-[12px] text-muted-foreground">{tool.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
