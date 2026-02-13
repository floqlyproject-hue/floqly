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

const FAQ_ITEMS = [
  {
    q: 'Нужен ли cookie-баннер по закону?',
    a: 'В России обработка персональных данных регулируется 152-ФЗ. Если ваш сайт собирает данные пользователей (включая cookie), рекомендуется информировать об этом и получать согласие.',
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
    a: 'Да, но для этого нужно обновить код на сайте. Создайте бесплатный аккаунт, чтобы управлять виджетом без изменения кода.',
  },
] as const

export default function CookieGeneratorPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Header */}
        <header className="mb-14">
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground sm:text-[32px]">
            Генератор Cookie-баннера
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
            Готовый документ по&nbsp;152-ФЗ, адаптивный баннер и&nbsp;код для&nbsp;вставки за&nbsp;5&nbsp;минут
          </p>
        </header>

        {/* Generator */}
        <CookieGeneratorClient />

        {/* FAQ Section */}
        <section className="mt-20" aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60"
          >
            Частые вопросы
          </h2>

          <div className="mt-8 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <article key={item.q}>
                <h3 className="text-[14px] font-medium leading-relaxed text-foreground">
                  {item.q}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
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
