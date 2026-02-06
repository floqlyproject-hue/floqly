'use client'

import { useEffect, useRef } from 'react'
import type { CookieType, DocumentSettings } from '../types'

interface CookieConfigFormProps {
  documentSettings: DocumentSettings
  cookieTypes: CookieType[]
  onDocumentSettingsChange: (settings: DocumentSettings) => void
  onCookieTypesChange: (types: CookieType[]) => void
}

export function CookieConfigForm({
  documentSettings,
  cookieTypes,
  onDocumentSettingsChange,
  onCookieTypesChange,
}: CookieConfigFormProps) {
  const prevSyncRef = useRef<string>('')

  // Auto-sync: analytics tools → analytics cookie, marketing → marketing cookie
  useEffect(() => {
    const hasAnalytics = documentSettings.analyticsTools.some((t) => t.enabled) || !!documentSettings.customAnalytics
    const hasMarketing = documentSettings.marketing.showAds || documentSettings.marketing.retargeting

    const syncKey = JSON.stringify({ hasAnalytics, hasMarketing })
    if (syncKey === prevSyncRef.current) return
    prevSyncRef.current = syncKey

    const updated = cookieTypes.map((ct) => {
      if (ct.id === 'analytics' && hasAnalytics && !ct.enabled) {
        return { ...ct, enabled: true }
      }
      if (ct.id === 'marketing' && hasMarketing && !ct.enabled) {
        return { ...ct, enabled: true }
      }
      return ct
    })

    if (JSON.stringify(updated) !== JSON.stringify(cookieTypes)) {
      onCookieTypesChange(updated)
    }
  }, [documentSettings, cookieTypes, onCookieTypesChange])

  const analyticsAutoEnabled = documentSettings.analyticsTools.some((t) => t.enabled) || !!documentSettings.customAnalytics
  const marketingAutoEnabled = documentSettings.marketing.showAds || documentSettings.marketing.retargeting

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-sm font-semibold text-primary ring-1 ring-primary/10">
          2
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">Настройка cookie и документа</h3>
          <p className="text-sm text-muted-foreground">Выберите параметры — документ сформируется автоматически</p>
        </div>
      </div>

      {/* Block 1: Document Tone */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Тон документа</label>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Тон документа">
          {([
            {
              value: 'legal' as const,
              label: 'Строгий',
              desc: 'Юридический стиль, ссылки на 152-ФЗ',
              icon: (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
                </svg>
              ),
            },
            {
              value: 'friendly' as const,
              label: 'Дружелюбный',
              desc: '«Мы» и «вы», тёплый тон',
              icon: (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              ),
            },
            {
              value: 'minimal' as const,
              label: 'Минимальный',
              desc: 'Кратко и по делу',
              icon: (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ),
            },
          ]).map(({ value, label, desc, icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={documentSettings.tone === value}
              onClick={() => onDocumentSettingsChange({ ...documentSettings, tone: value })}
              className={`group flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                documentSettings.tone === value
                  ? 'border-primary/40 bg-primary/[0.06] text-primary'
                  : 'border-border/60 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/60 hover:text-foreground'
              }`}
            >
              <span className={documentSettings.tone === value ? 'text-primary' : 'text-muted-foreground/70'}>{icon}</span>
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] leading-tight text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Block 2: Business Scenario */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Сценарий использования</label>
        <p className="text-xs text-muted-foreground">Выберите, что есть на вашем сайте — это добавит нужные разделы в документ</p>
        <div className="space-y-2">
          {([
            {
              key: 'ecommerce' as const,
              label: 'Интернет-магазин',
              desc: 'Корзина, заказы, доставка',
              icon: (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              ),
            },
            {
              key: 'authService' as const,
              label: 'Личный кабинет',
              desc: 'Авторизация, учётные записи',
              icon: (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              ),
            },
            {
              key: 'paidContent' as const,
              label: 'Платный контент',
              desc: 'Подписки, оплата, платёжные шлюзы',
              icon: (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              ),
            },
          ]).map(({ key, label, desc, icon }) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                documentSettings.businessScenario[key]
                  ? 'border-primary/30 bg-primary/[0.04]'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
              }`}
            >
              <input
                type="checkbox"
                checked={documentSettings.businessScenario[key]}
                onChange={(e) =>
                  onDocumentSettingsChange({
                    ...documentSettings,
                    businessScenario: { ...documentSettings.businessScenario, [key]: e.target.checked },
                  })
                }
                className="sr-only"
              />
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  documentSettings.businessScenario[key]
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/80 bg-background'
                }`}
              >
                {documentSettings.businessScenario[key] && (
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <span className={`text-muted-foreground ${documentSettings.businessScenario[key] ? 'text-primary' : ''}`}>
                {icon}
              </span>
              <div className="min-w-0">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="ml-2 text-xs text-muted-foreground">{desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Block 3: Analytics Tools */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Системы аналитики</label>
        <div className="space-y-2">
          {documentSettings.analyticsTools.map((tool) => (
            <label
              key={tool.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                tool.enabled
                  ? tool.isCrossBorder
                    ? 'border-amber-500/30 bg-amber-500/[0.04]'
                    : 'border-primary/30 bg-primary/[0.04]'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
              }`}
            >
              <input
                type="checkbox"
                checked={tool.enabled}
                onChange={(e) => {
                  const updated = documentSettings.analyticsTools.map((t) =>
                    t.id === tool.id ? { ...t, enabled: e.target.checked } : t
                  )
                  onDocumentSettingsChange({ ...documentSettings, analyticsTools: updated })
                }}
                className="sr-only"
              />
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  tool.enabled
                    ? tool.isCrossBorder
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/80 bg-background'
                }`}
              >
                {tool.enabled && (
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="text-sm font-medium text-foreground">{tool.name}</span>
                {!tool.isCrossBorder && tool.country === 'RU' && (
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600">RU</span>
                )}
                {tool.isCrossBorder && (
                  <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Трансграничная передача ({tool.country})
                  </span>
                )}
              </div>
            </label>
          ))}

          {/* Custom analytics input */}
          <div className="space-y-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                documentSettings.customAnalytics
                  ? 'border-primary/30 bg-primary/[0.04]'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
              }`}
            >
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  documentSettings.customAnalytics
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/80 bg-background'
                }`}
              >
                {documentSettings.customAnalytics && (
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">Другое</span>
            </label>
            {documentSettings.customAnalytics !== undefined && (
              <input
                type="text"
                value={documentSettings.customAnalytics}
                onChange={(e) => onDocumentSettingsChange({ ...documentSettings, customAnalytics: e.target.value })}
                placeholder="Название системы аналитики..."
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
          </div>
        </div>
      </div>

      {/* Block 4: Marketing */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Маркетинг и реклама</label>
        <div className="space-y-2">
          {([
            {
              key: 'showAds' as const,
              label: 'Показываем рекламу на сайте',
              desc: 'RTB, баннеры, рекламные блоки',
            },
            {
              key: 'retargeting' as const,
              label: 'Догоняем пользователей рекламой',
              desc: 'Ретаргетинг / Ремаркетинг',
            },
          ]).map(({ key, label, desc }) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                documentSettings.marketing[key]
                  ? 'border-primary/30 bg-primary/[0.04]'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
              }`}
            >
              <input
                type="checkbox"
                checked={documentSettings.marketing[key]}
                onChange={(e) =>
                  onDocumentSettingsChange({
                    ...documentSettings,
                    marketing: { ...documentSettings.marketing, [key]: e.target.checked },
                  })
                }
                className="sr-only"
              />
              <div
                className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  documentSettings.marketing[key]
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/80 bg-background'
                }`}
              >
                {documentSettings.marketing[key] && (
                  <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="ml-2 text-xs text-muted-foreground">{desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Block 5: Cookie Types (enhanced existing) */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Типы cookie</label>
        <div className="space-y-2">
          {cookieTypes.map((ct) => {
            const isAutoSynced =
              (ct.id === 'analytics' && analyticsAutoEnabled) ||
              (ct.id === 'marketing' && marketingAutoEnabled)

            return (
              <label
                key={ct.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                  ct.enabled
                    ? 'border-primary/30 bg-primary/[0.04]'
                    : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
                } ${ct.required ? 'cursor-default opacity-80' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={ct.enabled}
                  disabled={ct.required || isAutoSynced}
                  onChange={(e) => {
                    if (ct.required || isAutoSynced) return
                    const updated = cookieTypes.map((c) =>
                      c.id === ct.id ? { ...c, enabled: e.target.checked } : c
                    )
                    onCookieTypesChange(updated)
                  }}
                  className="sr-only"
                />
                <div
                  className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    ct.enabled
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/80 bg-background'
                  }`}
                >
                  {ct.enabled && (
                    <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div>
                    <span className="text-sm font-medium text-foreground">{ct.name}</span>
                    {ct.required && (
                      <span className="ml-1.5 text-[10px] text-muted-foreground">обязательные</span>
                    )}
                    {isAutoSynced && !ct.required && (
                      <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        Включено автоматически
                      </span>
                    )}
                  </div>
                </div>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
