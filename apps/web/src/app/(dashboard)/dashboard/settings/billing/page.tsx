'use client'

import Link from 'next/link'

const PLANS = [
  {
    id: 'free',
    name: 'Старт',
    price: '0',
    description: 'Попробовать бесплатно',
    features: [
      '1 сайт',
      'Плашка cookies',
      'Простой виджет',
      '1 000 показов в месяц',
      'Поддержка по почте',
    ],
    current: true,
  },
  {
    id: 'pro',
    name: 'Бизнес',
    price: '990',
    description: 'Для активных сайтов',
    features: [
      'До 10 сайтов',
      'Все инструменты',
      'Умный виджет',
      '50 000 показов в месяц',
      'Приоритетная поддержка',
      'Свой брендинг',
      'Доступ к API',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Корпоративный',
    price: 'custom',
    description: 'Для больших команд',
    features: [
      'Без ограничений по сайтам',
      'Без ограничений по показам',
      'Персональный менеджер',
      'SLA 99.9%',
      'Установка на ваш сервер',
      'Индивидуальные интеграции',
    ],
  },
]

export default function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Подписка</h1>
        <p className="mt-1 text-muted-foreground">
          Управление тарифом и оплатой
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 border-b border-border pb-4">
        <Link
          href="/dashboard/settings"
          className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Профиль
        </Link>
        <Link
          href="/dashboard/subscription"
          className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
        >
          Подписка
        </Link>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Ваш тариф</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Сейчас у вас бесплатный тариф
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
              Старт
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-foreground">0</span>
          <span className="text-lg text-muted-foreground">₽/мес</span>
        </div>

        <div className="mt-4 rounded-xl bg-muted/50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Показов использовано</span>
            <span className="font-medium text-foreground">0 из 1 000</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-0 rounded-full bg-primary" />
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Выберите тариф</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-2xl border p-6 ${
                plan.popular
                  ? 'border-primary bg-primary/[0.02]'
                  : plan.current
                    ? 'border-success/50 bg-success/[0.02]'
                    : 'border-border bg-card'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute right-3 top-3">
                  <span className="rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                    Выгодно
                  </span>
                </div>
              )}

              {/* Current Badge */}
              {plan.current && (
                <div className="absolute right-3 top-3">
                  <span className="rounded-md bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    Ваш тариф
                  </span>
                </div>
              )}

              {/* Plan Info */}
              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-1">
                {plan.price === 'custom' ? (
                  <span className="text-2xl font-bold text-foreground">По запросу</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">₽/мес</span>
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className="mt-0.5 size-4 shrink-0 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action */}
              <div className="mt-6">
                {plan.current ? (
                  <button
                    disabled
                    className="w-full rounded-xl border border-success/50 bg-success/10 py-2.5 text-sm font-medium text-success"
                  >
                    Ваш текущий тариф
                  </button>
                ) : plan.price === 'custom' ? (
                  <button className="w-full rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    Написать нам
                  </button>
                ) : (
                  <button className="w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    Выбрать {plan.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">История оплат</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Все ваши платежи и чеки
        </p>

        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <svg className="size-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Пока нет платежей
          </p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Способ оплаты</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Привяжите карту для автоматического продления
        </p>

        <div className="mt-6">
          <button className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Привязать карту
          </button>
        </div>
      </div>
    </div>
  )
}
