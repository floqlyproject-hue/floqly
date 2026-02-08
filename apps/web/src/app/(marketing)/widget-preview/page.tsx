import Link from 'next/link'

export const metadata = {
  title: 'Widget Designs - 10 дизайнов виджетов',
  description: 'Разработка дизайнов Simple Widget и Smart Widget для Floqly',
}

type Status = 'draft' | 'in-progress' | 'approved' | 'cancelled'

interface WidgetDesign {
  id: number
  number: string
  name: string
  description: string
  gradient: string
  simpleStatus: Status
  smartStatus: Status
  freeTier: boolean
}

const widgetDesigns: WidgetDesign[] = [
  {
    id: 1,
    number: '01',
    name: 'Plasma',
    description: 'Плазменный эффект с переливающимися формами',
    gradient: 'from-orange-500 via-red-500 to-yellow-500',
    simpleStatus: 'approved',
    smartStatus: 'draft',
    freeTier: true,
  },
  {
    id: 2,
    number: '02',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: true,
  },
  {
    id: 3,
    number: '03',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: true,
  },
  {
    id: 4,
    number: '04',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: true,
  },
  {
    id: 5,
    number: '05',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: true,
  },
  {
    id: 6,
    number: '06',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: false,
  },
  {
    id: 7,
    number: '07',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: false,
  },
  {
    id: 8,
    number: '08',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: false,
  },
  {
    id: 9,
    number: '09',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: false,
  },
  {
    id: 10,
    number: '10',
    name: 'TBD',
    description: 'Дизайн не определён',
    gradient: 'from-zinc-700 to-zinc-800',
    simpleStatus: 'draft',
    smartStatus: 'draft',
    freeTier: false,
  },
]

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    approved: 'bg-green-500/10 text-green-500',
    'in-progress': 'bg-yellow-500/10 text-yellow-500',
    draft: 'bg-muted text-muted-foreground',
    cancelled: 'bg-red-500/10 text-red-500',
  }

  const labels = {
    approved: '✅',
    'in-progress': '🔄',
    draft: '⬜',
    cancelled: '🚫',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

export default function WidgetPreviewPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Widget Designs</h1>
              <p className="mt-2 text-muted-foreground">
                10 дизайнов виджетов: Simple Widget (бесплатный) + Smart Widget (платный)
              </p>
            </div>
            <Link
              href="/widget-preview/README.md"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              📖 README
            </Link>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Статусы:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusBadge status="draft" />
              <span className="text-muted-foreground">Не начат</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusBadge status="in-progress" />
              <span className="text-muted-foreground">В работе</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusBadge status="approved" />
              <span className="text-muted-foreground">Утверждён</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StatusBadge status="cancelled" />
              <span className="text-muted-foreground">Отменён</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Designs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {widgetDesigns.map((design) => (
            <div
              key={design.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* Header with gradient and number */}
              <div className={`relative h-32 bg-gradient-to-br ${design.gradient}`}>
                <div className="absolute left-4 top-4 text-4xl font-bold text-white/90">
                  {design.number}
                </div>
                {design.freeTier && (
                  <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white">
                    FREE
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-foreground">{design.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{design.description}</p>

                {/* Statuses */}
                <div className="mt-4 flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Simple:</span>
                    <StatusBadge status={design.simpleStatus} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Smart:</span>
                    <StatusBadge status={design.smartStatus} />
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/widget-preview/design-${design.number}/simple`}
                    className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Simple
                  </Link>
                  <Link
                    href={`/widget-preview/design-${design.number}/smart`}
                    className="flex-1 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    Smart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Card */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Workflow разработки</h3>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                1
              </span>
              <p>
                <strong className="text-foreground">Разработка Simple Widget</strong> в{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">design-XX/simple/</code> →
                утверждение → статус ✅
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                2
              </span>
              <p>
                <strong className="text-foreground">Разработка Smart Widget</strong> (копируем
                утверждённый Simple как базу) → добавляем AI-фичи → утверждение → статус ✅
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                3
              </span>
              <p>
                <strong className="text-foreground">Трекинг прогресса</strong> →{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                  docs/WIDGET_DESIGNS_PROGRESS.md
                </code>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="https://github.com/anthropics/claude-code"
            target="_blank"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            📄 Полная инструкция (README.md)
          </Link>
          <Link
            href="https://github.com/anthropics/claude-code"
            target="_blank"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            📊 Трекер прогресса
          </Link>
        </div>
      </div>
    </main>
  )
}
