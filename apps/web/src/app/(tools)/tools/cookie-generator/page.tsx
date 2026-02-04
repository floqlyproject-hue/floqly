import type { Metadata } from 'next'
import { CookieGeneratorClient } from './cookie-generator-client'

export const metadata: Metadata = {
  title: 'Генератор Cookie-баннера — Floqly',
  description:
    'Бесплатный генератор плашки cookie-согласия для вашего сайта. Настройте внешний вид, текст и поведение баннера за несколько минут.',
  openGraph: {
    title: 'Генератор Cookie-баннера — Floqly',
    description:
      'Бесплатный генератор плашки cookie-согласия для вашего сайта',
    type: 'website',
  },
}

const FEATURES = [
  { text: 'Соответствует 152-ФЗ' },
  { text: 'Адаптивный дизайн' },
  { text: 'Работает везде' },
  { text: 'Без подписки' },
] as const

const FAQ_ITEMS = [
  {
    q: 'Нужен ли cookie-баннер по закону?',
    a: 'В России обработка персональных данных регулируется 152-ФЗ. Если вы собираете любые данные пользователей (включая cookie), рекомендуется информировать об этом и получать согласие.',
  },
  {
    q: 'Как установить баннер на сайт?',
    a: 'Скопируйте сгенерированный код и вставьте его перед закрывающим тегом </body> на вашем сайте. Баннер появится автоматически.',
  },
  {
    q: 'Будет ли работать на Tilda/Wix?',
    a: 'Да! Наш виджет работает на любых платформах, включая конструкторы сайтов. Просто добавьте код через встроенный HTML-блок.',
  },
  {
    q: 'Можно ли изменить настройки после установки?',
    a: 'Да, но для этого нужно будет обновить код. Создайте бесплатный аккаунт, чтобы управлять виджетом без изменения кода на сайте.',
  },
] as const

export default function CookieGeneratorPage() {
  return (
    <main className="min-h-screen">
      {/* Subtle background gradient */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-start gap-4 sm:items-center">
            {/* Icon with refined gradient */}
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 ring-1 ring-primary/10 sm:size-16">
              <svg
                className="size-7 text-primary sm:size-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {/* Subtle glow */}
              <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/20 blur-xl" />
            </div>

            <div className="space-y-1">
              <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Генератор Cookie-баннера
              </h1>
              <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
                Создайте стильный баннер согласия на использование cookie за пару минут
              </p>
            </div>
          </div>

          {/* Features - refined badges */}
          <div className="mt-8 flex flex-wrap gap-2" role="list" aria-label="Особенности генератора">
            {FEATURES.map((feature) => (
              <div
                key={feature.text}
                role="listitem"
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/[0.04] px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/[0.08]"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </header>

        {/* Generator */}
        <CookieGeneratorClient />

        {/* FAQ Section */}
        <section className="mt-20 pt-12" aria-labelledby="faq-heading">
          {/* Divider with gradient */}
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <h2
            id="faq-heading"
            className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Часто задаваемые вопросы
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FAQ_ITEMS.map((item, index) => (
              <article
                key={item.q}
                className="group relative rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/60 hover:shadow-lg hover:shadow-primary/[0.02]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Subtle corner accent */}
                <div className="absolute right-4 top-4 size-8 rounded-full bg-gradient-to-br from-primary/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <h3 className="text-pretty font-medium leading-snug text-foreground">
                  {item.q}
                </h3>
                <p className="mt-2.5 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
