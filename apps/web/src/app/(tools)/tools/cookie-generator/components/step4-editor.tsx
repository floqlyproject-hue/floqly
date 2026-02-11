'use client'

import { useState } from 'react'
import { Pencil, Palette } from 'lucide-react'
import type { CookieConfig } from '../types'
import { BannerPreview, DEFAULT_CUSTOMIZATION } from './banner-preview'
import type { BannerCustomization } from './liquid-glass-island'
import { Step4ContentTab } from './step4-content-tab'

/* ── Sub-tab definitions ── */
type SubTab = 'content' | 'design'

const SUB_TABS: { id: SubTab; label: string; icon: typeof Pencil; hint: string }[] = [
  { id: 'content', label: 'Содержание', icon: Pencil, hint: 'Текст, кнопки и ссылки' },
  { id: 'design', label: 'Оформление', icon: Palette, hint: 'Стиль, позиция и анимация' },
]

/* ── Component ── */
interface Step4EditorProps {
  config: CookieConfig
  screenshotUrl: string | null
  isScreenshotLoading: boolean
}

export function Step4Editor({
  config,
  screenshotUrl,
  isScreenshotLoading,
}: Step4EditorProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('content')
  const [showHint, setShowHint] = useState(true)

  // Shared customization state — lifted here, passed to both sub-tabs
  const [customization, setCustomization] = useState<BannerCustomization>(DEFAULT_CUSTOMIZATION)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-[22px] font-semibold tracking-tight text-foreground">
          Настройка баннера
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground/70">
          Настройте содержание и внешний вид вашего cookie-баннера
        </p>
      </div>

      {/* Hint — dismissible */}
      {showHint && (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06]">
            <svg className="size-3 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">
            Сначала настройте <span className="font-medium text-foreground/80">содержание</span> баннера — текст и кнопки.
            Затем переключитесь на <span className="font-medium text-foreground/80">оформление</span> для визуальной настройки.
          </p>
          <button
            type="button"
            onClick={() => setShowHint(false)}
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground/40 transition-colors hover:text-foreground/60"
            aria-label="Скрыть подсказку"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Sub-tab switcher — segmented control */}
      <div className="inline-flex items-center rounded-xl bg-muted/50 p-1">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground/70'
              }`}
            >
              <Icon className="size-4" strokeWidth={1.75} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Sub-tab content */}
      <div key={activeSubTab} className="step-enter">
        {activeSubTab === 'content' ? (
          <Step4ContentTab
            customization={customization}
            onCustomizationChange={setCustomization}
          />
        ) : (
          <BannerPreview
            config={config}
            screenshotUrl={screenshotUrl}
            isScreenshotLoading={isScreenshotLoading}
            customization={customization}
            onCustomizationChange={setCustomization}
            hideTextPanel
          />
        )}
      </div>
    </div>
  )
}
