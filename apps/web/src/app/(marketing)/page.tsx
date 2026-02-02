import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Умные виджеты
            <br />
            <span className="text-primary">для вашего сайта</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Экосистема виджетов с AI-чатом. Cookie Generator, Simple Widget и
            умный AI-виджет для увеличения конверсии.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Начать бесплатно
            </Link>
            <Link
              href="/tools/cookie-generator"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Попробовать
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-foreground">
            Наши инструменты
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Бесплатные инструменты для вашего сайта
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Cookie Generator */}
            <Link
              href="/tools/cookie-generator"
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 size-12 rounded-lg bg-primary/10 p-3">
                <svg
                  className="size-full text-primary"
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
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary">
                Cookie Generator
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Генератор плашки cookie-согласия. Настройка стиля, текста и
                поведения. Бесплатно.
              </p>
            </Link>

            {/* Simple Widget */}
            <Link
              href="/tools/simple-widget"
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-success/50 hover:shadow-lg"
            >
              <div className="mb-4 size-12 rounded-lg bg-success/10 p-3">
                <svg
                  className="size-full text-success"
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
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-success">
                Simple Widget
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Конструктор кнопок связи: WhatsApp, Telegram, VK и другие
                каналы. Бесплатно.
              </p>
            </Link>

            {/* AI Widget */}
            <div className="relative rounded-xl border border-border bg-card p-6 opacity-75">
              <div className="absolute -top-3 right-4 rounded-full bg-warning px-3 py-1 text-xs font-medium text-warning-foreground">
                Скоро
              </div>
              <div className="mb-4 size-12 rounded-lg bg-warning/10 p-3">
                <svg
                  className="size-full text-warning"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">
                AI-виджет
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Умный чат-бот с AI для автоматизации поддержки и сбора лидов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
              Готовы начать?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Создайте свой первый виджет за несколько минут. Бесплатно и без
              регистрации.
            </p>
            <Link
              href="/tools/cookie-generator"
              className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
            >
              Попробовать Cookie Generator
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
