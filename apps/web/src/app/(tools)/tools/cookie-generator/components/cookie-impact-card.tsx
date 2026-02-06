'use client'

import type { CookieType, DocumentSettings } from '../types'

interface CookieImpactCardProps {
  cookieTypes: CookieType[]
  documentSettings: DocumentSettings
}

const TONE_LABELS = {
  legal: 'Строгий юридический',
  friendly: 'Дружелюбный',
  minimal: 'Минимальный',
} as const

export function CookieImpactCard({ cookieTypes, documentSettings }: CookieImpactCardProps) {
  const enabledCookies = cookieTypes.filter((c) => c.enabled).length
  const totalCookies = cookieTypes.length
  const enabledAnalytics = documentSettings.analyticsTools.filter((t) => t.enabled)
  const hasCrossBorder = enabledAnalytics.some((t) => t.isCrossBorder)
  const hasMarketing = documentSettings.marketing.showAds || documentSettings.marketing.retargeting
  const scenarioCount = [
    documentSettings.businessScenario.ecommerce,
    documentSettings.businessScenario.authService,
    documentSettings.businessScenario.paidContent,
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/60">Сводка настроек</h3>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Документ формируется автоматически
        </p>
      </div>

      {/* Tone badge */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Тон документа</p>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-foreground/[0.05] px-2.5 py-1.5 text-xs font-medium text-foreground/70">
          {TONE_LABELS[documentSettings.tone]}
        </span>
      </div>

      {/* Business scenarios */}
      {scenarioCount > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Сценарии ({scenarioCount})</p>
          <div className="flex flex-wrap gap-1.5">
            {documentSettings.businessScenario.ecommerce && (
              <span className="inline-flex items-center rounded-lg bg-foreground/[0.05] px-2 py-1 text-xs text-foreground/70">
                Магазин
              </span>
            )}
            {documentSettings.businessScenario.authService && (
              <span className="inline-flex items-center rounded-lg bg-foreground/[0.05] px-2 py-1 text-xs text-foreground/70">
                Личный кабинет
              </span>
            )}
            {documentSettings.businessScenario.paidContent && (
              <span className="inline-flex items-center rounded-lg bg-foreground/[0.05] px-2 py-1 text-xs text-foreground/70">
                Платный контент
              </span>
            )}
          </div>
        </div>
      )}

      {/* Analytics */}
      {enabledAnalytics.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Аналитика ({enabledAnalytics.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {enabledAnalytics.map((tool) => (
              <span
                key={tool.id}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                  tool.isCrossBorder
                    ? 'bg-amber-500/[0.08] text-amber-600'
                    : 'bg-emerald-500/[0.08] text-emerald-600'
                }`}
              >
                {tool.name}
                {tool.isCrossBorder && (
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                )}
              </span>
            ))}
          </div>
          {hasCrossBorder && (
            <p className="text-[10px] leading-tight text-amber-600">
              Трансграничная передача — раздел будет добавлен в документ
            </p>
          )}
        </div>
      )}

      {/* Marketing */}
      {hasMarketing && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Маркетинг</p>
          <div className="flex flex-wrap gap-1.5">
            {documentSettings.marketing.showAds && (
              <span className="inline-flex items-center rounded-lg bg-foreground/[0.05] px-2 py-1 text-xs text-foreground/70">
                Реклама
              </span>
            )}
            {documentSettings.marketing.retargeting && (
              <span className="inline-flex items-center rounded-lg bg-foreground/[0.05] px-2 py-1 text-xs text-foreground/70">
                Ретаргетинг
              </span>
            )}
          </div>
        </div>
      )}

      {/* Cookie count */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Cookie</p>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-foreground transition-all duration-300"
              style={{ width: `${(enabledCookies / totalCookies) * 100}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">
            {enabledCookies} из {totalCookies}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-lg border border-border bg-background px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-xs leading-relaxed text-muted-foreground">
          <svg className="size-3.5 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Документ формируется автоматически на основе ваших настроек
        </p>
      </div>
    </div>
  )
}
