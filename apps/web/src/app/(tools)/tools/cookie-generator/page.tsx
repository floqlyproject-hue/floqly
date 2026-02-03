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

export default function CookieGeneratorPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <svg
              className="size-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Генератор Cookie-баннера
            </h1>
            <p className="mt-1 text-muted-foreground">
              Создайте стильный баннер согласия на использование cookie за пару минут
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { icon: '✓', text: 'Соответствует 152-ФЗ' },
            { icon: '✓', text: 'Адаптивный дизайн' },
            { icon: '✓', text: 'Работает везде' },
            { icon: '✓', text: 'Без подписки' },
          ].map((feature) => (
            <div
              key={feature.text}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              <span>{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generator */}
      <CookieGeneratorClient />

      {/* FAQ Section */}
      <section className="mt-16 border-t border-border pt-12">
        <h2 className="text-xl font-semibold text-foreground">
          Часто задаваемые вопросы
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
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
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-border bg-card/50 p-4"
            >
              <h3 className="font-medium text-foreground">{item.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
