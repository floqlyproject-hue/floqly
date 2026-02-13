'use client'

import type { ActiveTab } from '../cookie-generator-client'

const STEPS: { id: ActiveTab; label: string; description: string; icon: React.ReactNode }[] = [
  {
    id: 'company',
    label: 'Компания',
    description: 'Название, сайт и контакты',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
      </svg>
    ),
  },
  {
    id: 'cookies',
    label: 'Cookie и сервисы',
    description: 'Функции, аналитика, маркетинг',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'document',
    label: 'Документ',
    description: 'Текст политики cookie',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'design',
    label: 'Оформление',
    description: 'Дизайн и текст баннера',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
  },
  {
    id: 'result',
    label: 'Результат',
    description: 'Код для установки',
    icon: (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

interface WizardProgressCardProps {
  activeTab: ActiveTab
}

export function WizardProgressCard({ activeTab }: WizardProgressCardProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === activeTab)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground">Что вы создадите</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Пройдите 5 шагов, чтобы настроить баннер cookie для вашего сайта
        </p>
      </div>

      <div className="space-y-1">
        {STEPS.map((step, index) => {
          const isCurrent = index === currentIndex
          const isCompleted = index < currentIndex

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 ${
                isCurrent
                  ? 'bg-primary/[0.08] ring-1 ring-primary/20'
                  : isCompleted
                    ? 'opacity-60'
                    : 'opacity-40'
              }`}
            >
              {/* Step indicator */}
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                  isCompleted
                    ? 'bg-primary/15 text-primary'
                    : isCurrent
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted/60 text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>

              {/* Step text */}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${isCurrent ? 'text-foreground' : 'text-foreground/80'}`}>
                  {step.label}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {/* Current indicator */}
              {isCurrent && (
                <div className="size-1.5 shrink-0 rounded-full bg-primary" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
