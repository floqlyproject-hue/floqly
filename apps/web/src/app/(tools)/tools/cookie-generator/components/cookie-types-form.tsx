'use client'

import type { CookieType } from '../types'

interface CookieTypesFormProps {
  data: CookieType[]
  onChange: (data: CookieType[]) => void
}

export function CookieTypesForm({ data, onChange }: CookieTypesFormProps) {
  const handleToggle = (id: string) => {
    onChange(
      data.map((cookie) =>
        cookie.id === id && !cookie.required
          ? { ...cookie, enabled: !cookie.enabled }
          : cookie
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          2
        </div>
        Типы cookie
      </div>

      <div className="space-y-2 rounded-lg border border-border bg-card/50 p-4">
        <p className="mb-3 text-xs text-muted-foreground">
          Выберите, какие типы cookie использует ваш сайт
        </p>

        {data.map((cookie) => (
          <div
            key={cookie.id}
            className={`group flex items-start gap-3 rounded-lg border p-3 transition-colors ${
              cookie.enabled
                ? 'border-primary/30 bg-primary/5'
                : 'border-border bg-transparent hover:bg-muted/50'
            }`}
          >
            <button
              type="button"
              onClick={() => handleToggle(cookie.id)}
              disabled={cookie.required}
              className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${
                cookie.enabled ? 'bg-primary' : 'bg-input'
              } ${cookie.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              <span
                className={`absolute top-0.5 block size-4 rounded-full bg-white shadow-sm transition-transform ${
                  cookie.enabled ? 'left-[18px]' : 'left-0.5'
                }`}
              />
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {cookie.name}
                </span>
                {cookie.required && (
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Обязательно
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {cookie.description}
              </p>
            </div>
          </div>
        ))}

        <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 p-2.5 text-xs text-amber-700 dark:text-amber-400">
          <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Включите только те типы cookie, которые реально используются на вашем сайте
          </span>
        </div>
      </div>
    </div>
  )
}
