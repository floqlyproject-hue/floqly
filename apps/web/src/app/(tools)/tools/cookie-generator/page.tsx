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
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Генератор Cookie-баннера
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Создайте стильный баннер согласия на использование cookie за пару минут
          </p>

          {/* Features */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {FEATURES.map((feature) => (
              <li
                key={feature.text}
                className="flex items-center gap-2 text-[13px] text-muted-foreground"
              >
                <svg
                  className="size-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </header>

        {/* Generator */}
        <CookieGeneratorClient />

        {/* FAQ Section */}
        <section className="mt-16 border-t border-border pt-12" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-[15px] font-semibold tracking-tight text-foreground"
          >
            Частые вопросы
          </h2>

          <div className="relative mt-6">
            {/* Cross dividers — desktop only */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-border sm:block" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px bg-border sm:block" aria-hidden="true" />

            <div className="divide-y divide-border sm:grid sm:grid-cols-2 sm:divide-y-0">
              {FAQ_ITEMS.map((item, i) => {
                const isLeft = i % 2 === 0
                const isTop = i < 2
                return (
                  <article
                    key={item.q}
                    className={`py-6 first:pt-0 last:pb-0 sm:py-0 ${
                      isLeft ? 'sm:pr-8' : 'sm:pl-8'
                    } ${isTop ? 'sm:pb-8' : 'sm:pt-8'}`}
                  >
                    <h3 className="text-[13px] font-semibold leading-relaxed text-foreground">
                      {item.q}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
