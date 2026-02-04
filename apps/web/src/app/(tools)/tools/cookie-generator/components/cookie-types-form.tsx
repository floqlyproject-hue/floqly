'use client'

import type { CookieType } from '../types'

interface CookieTypesFormProps {
  data: CookieType[]
  onChange: (data: CookieType[]) => void
}

const COOKIE_ICONS: Record<string, React.ReactNode> = {
  necessary: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  analytics: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  marketing: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
    </svg>
  ),
  functional: (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
    </svg>
  ),
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
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary ring-1 ring-primary/10">
          2
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">Типы cookie</h3>
          <p className="text-sm text-muted-foreground">Выберите, какие cookie использует сайт</p>
        </div>
      </div>

      {/* Cookie Types List */}
      <div className="space-y-3" role="group" aria-label="Типы cookie">
        {data.map((cookie) => (
          <div
            key={cookie.id}
            className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
              cookie.enabled
                ? 'border-primary/30 bg-primary/[0.04]'
                : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
            }`}
          >
            {/* Active indicator */}
            {cookie.enabled && (
              <div className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
            )}

            <div className="flex items-start gap-4">
              {/* Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={cookie.enabled}
                aria-label={`${cookie.name}: ${cookie.enabled ? 'включено' : 'выключено'}`}
                onClick={() => handleToggle(cookie.id)}
                disabled={cookie.required}
                className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  cookie.enabled ? 'bg-primary' : 'bg-input'
                } ${cookie.required ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                <span
                  className={`absolute top-0.5 block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    cookie.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </button>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className={`transition-colors ${cookie.enabled ? 'text-primary' : 'text-muted-foreground'}`}>
                    {COOKIE_ICONS[cookie.id] || COOKIE_ICONS.functional}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {cookie.name}
                  </span>
                  {cookie.required && (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      Обязательно
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {cookie.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/[0.06] p-4">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-warning/15">
          <svg className="size-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm leading-relaxed text-foreground/80">
          Включите только те типы cookie, которые <span className="font-medium text-foreground">реально используются</span> на вашем сайте
        </p>
      </div>
    </div>
  )
}
