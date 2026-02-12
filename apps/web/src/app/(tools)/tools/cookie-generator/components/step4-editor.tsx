'use client'

import { useState } from 'react'
import type { CookieConfig } from '../types'
import { BannerPreview, DEFAULT_CUSTOMIZATION } from './banner-preview'
import type { BannerCustomization } from './liquid-glass-island'
import { Step4ContentTab } from './step4-content-tab'

/* ── Sub-tab definitions ── */
type SubTab = 'content' | 'design'

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

  // Shared customization state — lifted here, passed to both sub-tabs
  const [customization, setCustomization] = useState<BannerCustomization>(DEFAULT_CUSTOMIZATION)

  return (
    <div className="space-y-4">
      {/* Sub-tab switcher — compact segmented control */}
      <div className="inline-flex items-center rounded-lg bg-muted/50 p-0.5">
        <button
          type="button"
          onClick={() => setActiveSubTab('content')}
          className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 ${
            activeSubTab === 'content'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground/70'
          }`}
        >
          Содержание
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('design')}
          className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 ${
            activeSubTab === 'design'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground/70'
          }`}
        >
          Оформление
        </button>
      </div>

      {/* Sub-tab content */}
      <div key={activeSubTab}>
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
