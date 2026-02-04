import Link from 'next/link'

export const metadata = {
  title: 'Widget Preview - Дизайны виджетов',
  description: 'Превью 5 дизайнов простого виджета Floqly',
}

const sandbox = {
  slug: 'sandbox',
  name: 'Песочница',
  description: 'Тестирование новых дизайнов перед созданием страницы',
}

const designs = [
  {
    id: 1,
    slug: 'design-1-liquid-glass',
    name: 'Liquid Glass',
    description: 'Glassmorphism эффект с размытием и прозрачностью',
    gradient: 'from-purple-500 via-blue-500 to-cyan-500',
    status: 'draft',
  },
  {
    id: 2,
    slug: 'design-2-neomorphism',
    name: 'Neomorphism',
    description: 'Мягкие тени, эффект вдавленности и выпуклости',
    gradient: 'from-gray-400 via-gray-300 to-gray-400',
    status: 'draft',
  },
  {
    id: 3,
    slug: 'design-3-minimalism',
    name: 'Minimalism',
    description: 'Чистый дизайн, контрастные цвета, строгие линии',
    gradient: 'from-zinc-900 via-zinc-700 to-zinc-900',
    status: 'draft',
  },
  {
    id: 4,
    slug: 'design-4-abstract',
    name: 'Abstract',
    description: 'Яркие градиенты, необычные формы, креатив',
    gradient: 'from-orange-500 via-pink-500 to-purple-600',
    status: 'draft',
  },
  {
    id: 5,
    slug: 'design-5-modern',
    name: 'Modern',
    description: 'Современный тренд 2025-2026, микроанимации',
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    status: 'draft',
  },
]

export default function WidgetPreviewPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">Widget Preview</h1>
          <p className="mt-2 text-muted-foreground">
            5 дизайнов простого виджета для тестирования и утверждения
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {designs.map((design) => (
            <Link
              key={design.id}
              href={`/widget-preview/${design.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Gradient Preview */}
              <div className={`h-40 bg-gradient-to-br ${design.gradient}`}>
                {/* Fake widget button */}
                <div className="flex h-full items-end justify-end p-4">
                  <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110" />
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {design.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {design.description}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      design.status === 'approved'
                        ? 'bg-green-500/10 text-green-500'
                        : design.status === 'in-progress'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {design.status === 'approved'
                      ? 'Утверждён'
                      : design.status === 'in-progress'
                        ? 'В работе'
                        : 'Черновик'}
                  </span>
                </div>

                <div className="mt-4 flex items-center text-sm text-primary">
                  <span>Открыть превью</span>
                  <svg
                    className="ml-1 size-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground">Процесс работы</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Черновик
              </span>
              <span className="text-sm text-muted-foreground">Начальная версия</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">
                В работе
              </span>
              <span className="text-sm text-muted-foreground">Дорабатывается</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                Утверждён
              </span>
              <span className="text-sm text-muted-foreground">Готов к использованию</span>
            </div>
          </div>
        </div>

        {/* Sandbox */}
        <div className="mt-8 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{sandbox.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{sandbox.description}</p>
            </div>
            <Link
              href={`/widget-preview/${sandbox.slug}`}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Открыть
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/tools/simple-widget"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Конструктор виджета
          </Link>
        </div>
      </div>
    </main>
  )
}
