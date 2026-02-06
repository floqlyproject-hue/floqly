'use client'

import type { CookieType } from '../types'

interface CookieImpactCardProps {
  cookieTypes: CookieType[]
}

export function CookieImpactCard({ cookieTypes }: CookieImpactCardProps) {
  const enabledTypes = cookieTypes.filter((c) => c.enabled)
  const disabledTypes = cookieTypes.filter((c) => !c.enabled)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground">Влияние на баннер</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Включённые типы cookie будут показаны пользователям в настройках баннера
        </p>
      </div>

      {/* Enabled cookies */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          Включены ({enabledTypes.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {enabledTypes.map((cookie) => (
            <span
              key={cookie.id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/[0.08] px-2.5 py-1.5 text-xs font-medium text-primary ring-1 ring-primary/15"
            >
              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              {cookie.name}
              {cookie.required && (
                <span className="text-[10px] text-primary/60">·&nbsp;обяз.</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Disabled cookies */}
      {disabledTypes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Отключены ({disabledTypes.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {disabledTypes.map((cookie) => (
              <span
                key={cookie.id}
                className="inline-flex items-center gap-1.5 rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs text-muted-foreground ring-1 ring-border/50"
              >
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {cookie.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg bg-muted/30 px-3 py-2.5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Пользователи смогут управлять необязательными cookie через кнопку «Настройки» в баннере
        </p>
      </div>
    </div>
  )
}
