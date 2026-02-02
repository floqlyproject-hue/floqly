import Link from 'next/link'

export const metadata = {
  title: 'Личный кабинет',
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Добро пожаловать</h1>
        <p className="mt-1 text-muted-foreground">
          Управляйте своими виджетами и проектами
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Проекты</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Виджеты</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Показы (мес.)</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Лиды (мес.)</p>
          <p className="mt-2 text-3xl font-bold text-foreground">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Быстрые действия</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/projects/new"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground group-hover:text-primary">
                Новый проект
              </p>
              <p className="text-sm text-muted-foreground">
                Создать новый сайт
              </p>
            </div>
          </Link>

          <Link
            href="/tools/cookie-generator"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-success/50 hover:shadow-md"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/10 text-success">
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground group-hover:text-success">
                Cookie Generator
              </p>
              <p className="text-sm text-muted-foreground">
                Создать плашку cookie
              </p>
            </div>
          </Link>

          <Link
            href="/tools/simple-widget"
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-warning/50 hover:shadow-md"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground group-hover:text-warning">
                Simple Widget
              </p>
              <p className="text-sm text-muted-foreground">
                Кнопки связи
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Empty State */}
      <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <div className="mx-auto size-12 rounded-full bg-muted p-3">
          <svg
            className="size-full text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-foreground">
          Нет проектов
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Создайте свой первый проект, чтобы начать использовать виджеты
        </p>
        <Link
          href="/dashboard/projects/new"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Создать проект
        </Link>
      </div>
    </div>
  )
}
